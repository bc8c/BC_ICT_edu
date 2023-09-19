package chaincode

import ( 
	"github.com/hyperledger/fabric-contract-api-go/contractapi"

	"time"
	"strconv"
	"crypto/sha256"
	"encoding/binary"
	"encoding/json"
	"math"
	"fmt"
)

type SmartContract struct{
	contractapi.Contract
}

// var funguscount int = 0

type Fungus struct{
	FungusId	uint
	Name		string
	Owner		string
	Dna			uint
	ReadyTime	uint32
}

func (s *SmartContract) Initialize(ctx contractapi.TransactionContextInterface) error {	
	
	// funguscount 값 읽어오기
	funguscountJSON, err := ctx.GetStub().GetState("funguscount")
	if err !=nil {
		 return err
	}
	if funguscountJSON != nil{
		return fmt.Errorf("funguscount is already set")
	}
	
	//  funguscount를 0으로 초기화 시키는 부분
	err = ctx.GetStub().PutState("funguscount", []byte(strconv.Itoa(0)))
	if err !=nil {
		return err
   	}
	return nil
}

func (s *SmartContract) CreateRandomFungus(ctx contractapi.TransactionContextInterface, name string) error {

	// 최초 실행인지 확인하는 과정
	// 특정 변수에 0을 초기화 해두고, 최초실행시 조회해서 0이면 동작 0이 아니면 error 반환
	// ctx를 활용하여 Client ID를 알아내기
	clientID,err := ctx.GetClientIdentity().GetID()
	if err !=nil {
		return fmt.Errorf("failed to get clientID : %v", err)
   	}

	fungiCountJSON, err := ctx.GetStub().GetState(clientID)
	if err !=nil {
		 return err
	}
	if fungiCountJSON !=nil {
		// 이미 이전에 최초 버섯을 생성 한 적이 있는 경우
		return fmt.Errorf("the Client has already created an initial fungus")
	}
	// DNA를 생성
	dna := s._generateRandomDna(name)
	err = s._createFungus(ctx, name, dna)
	if err !=nil {
		return err
   	}

	err = ctx.GetStub().PutState(clientID,[]byte("1"))
	if err !=nil {
		return err
   	}
	return nil
}

func (s *SmartContract)_createFungus(ctx contractapi.TransactionContextInterface, name string, dna uint) error  {

	// New 버섯 data를 생성
	// ID : 생성된 총 버섯수(count) + 1
	// 버섯이름 : 사용자로부터 입력 받은 name을 사용
	// 소유주 : 이 요청을 보낸 사람의 ClientID
	// 증식가능시간 : 현재시간 + 1분
	// DNA : 이미생성된 DAT를 사용함

	// 현재시간 계산하기
	nowtime := time.Now()
	unixtime := nowtime.Unix()

	// funguscount 값 읽어오기
	funguscountJSON, err := ctx.GetStub().GetState("funguscount")
	if err !=nil {
		 return err
	}
	fungusIdINT,_ := strconv.Atoi(string(funguscountJSON))

	// ctx를 활용하여 Client ID를 알아내기
	clientID,err := ctx.GetClientIdentity().GetID()
	if err !=nil {
		return fmt.Errorf("failed to get clientID : %v", err)
   	}

	fungus := Fungus{
		FungusId: uint(fungusIdINT) + 1,
		Name: name,
		Owner: clientID,
		Dna: dna,
		ReadyTime: uint32(unixtime) + 60,
	}
	
	fungusJSON, err := json.Marshal(fungus)
	if err !=nil {
		return err
   	}
	err = ctx.GetStub().PutState(strconv.Itoa(int(fungus.FungusId)), fungusJSON )
	if err !=nil {
		return err
   	}

	fungusIdINT += 1 
	err = ctx.GetStub().PutState("funguscount", []byte(strconv.Itoa(fungusIdINT)))
	if err !=nil {
		return err
   	}

	return nil
}

func (s *SmartContract) _generateRandomDna(name string) uint {

	// 14자리의 숫자
	//  ( 3:3:3:3:2 ) 로 정보가 들어가야한다.
	// 현재시간+입력받은 버섯이름 -> SHA256으로 해시코드생성 -> 숫자로 변환 -> 14자의 숫자로 변환 -> 맨 끝 두지라를 00으로 바꾸면 == DNA

	nowtime := time.Now()
	unixtime := nowtime.Unix()
	data := strconv.Itoa(int(unixtime)) + name // ex> 1694689166myfirstFungus
	hash := sha256.New()
	hash.Write([]byte(data))

	dnaHash := uint(binary.BigEndian.Uint64(hash.Sum(nil)))

	dna := dnaHash % uint(math.Pow(10, 14))
	dna = dna - (dna % 100)

	return dna	
} 

func (s *SmartContract) GetFungiByOwner(ctx contractapi.TransactionContextInterface) ([]*Fungus, error) {
	// ctx를 활용하여 Client ID를 알아내기
	clientID, err := ctx.GetClientIdentity().GetID()
	if err !=nil {
		return nil, fmt.Errorf("failed to get clientID : %v", err)
   	}

	queryString := fmt.Sprintf( `{"selector":{"Owner":"%s"}}`,clientID)

	resultsIterator,err := ctx.GetStub().GetQueryResult(queryString)
	if err !=nil {
		return nil, err
   	}
	defer resultsIterator.Close()

	var fungi []*Fungus
	for resultsIterator.HasNext() {
		queryResult,err := resultsIterator.Next()
		if err !=nil {
			return nil, err
		}
		var fungus Fungus
		err = json.Unmarshal(queryResult.Value, &fungus)
		if err !=nil {
			return nil, err
		}
		fungi = append(fungi, &fungus)
	}

	return fungi, nil
}

func (s *SmartContract) TransferFrom(ctx contractapi.TransactionContextInterface, from string, to string, fungusid uint ) error {
	// 조건1 : from이 함수를 호출한 ClientID와 동일한경우 ( 본인만 )
	// ctx를 활용하여 Client ID를 알아내기
	clientID, err := ctx.GetClientIdentity().GetID()
	if err !=nil {
		return fmt.Errorf("failed to get clientID : %v", err)
   	}
	if clientID != from {
		return fmt.Errorf("clientID != from ")
	}
	// 조건2 : 조회한 버섯의 Owner가 from 이랑 같은경우 ( 버섯의 주인인경우 )
	fungusBytes, err := ctx.GetStub().GetState(strconv.Itoa(int(fungusid)))
	if err !=nil {
		return err
   	}
	if fungusBytes == nil { // 거래하고자 하는 버섯이 존재하지 않는경우
		return fmt.Errorf("not exists fungus")
	}

	var fungus Fungus
	err = json.Unmarshal(fungusBytes, &fungus)
	if err !=nil {
		return err
   	}
	if fungus.Owner != from {
		return fmt.Errorf("not a fungus owner's request")
	}

	// from -> to fungusID 의 버섯의 Owner 를 변경해준다.
	fungus.Owner = to

	fungusJSON, err := json.Marshal(fungus)
	if err !=nil {
		return err
   	}
	err = ctx.GetStub().PutState(strconv.Itoa(int(fungus.FungusId)), fungusJSON )
	if err !=nil {
		return err
   	}

	// 각각 소유한 버섯 count 갱신하기
	// from 갱신하기
	err = s._updateOwnerFungusCount(ctx, from, -1)
	if err !=nil {
		return err
   	}

	// to 갱신하기
	err = s._updateOwnerFungusCount(ctx, to, 1)
	if err !=nil {
		return err
   	}
	return nil
}

func (s *SmartContract)_updateOwnerFungusCount(ctx contractapi.TransactionContextInterface, clientID string, increment int) error {
	countBytes, err := ctx.GetStub().GetState(clientID)
	if err !=nil {
		return err
   	}

	count,_ := strconv.Atoi(string(countBytes[:]))
	count += increment
	err = ctx.GetStub().PutState(clientID, []byte(strconv.Itoa(count)))
	if err !=nil {
		return err
   	}
	return nil
}

func (s *SmartContract)Feed(ctx contractapi.TransactionContextInterface, fungusid uint, feedid uint) error {
	
	
	// Feed 함수(기능)에 포함되어야 할 중요 작업들

	//  1. fungusid를 이용하여 버섯의 DNA를 획득
	fungusBytes, err := ctx.GetStub().GetState(strconv.Itoa(int(fungusid)))
	if err !=nil {
		return err
   	}
	if fungusBytes == nil {
		return fmt.Errorf("not exists fungus")
	}

	var fungus Fungus

	err = json.Unmarshal(fungusBytes, &fungus)
	if err !=nil {
		return err
   	}

	// 버섯의 ReadyTime 을 체크해서 증식가능한 시간인지 확이후 진행 해야함
	// 버섯의 ReadyTime < 현재시간
	nowTime := time.Now()
	unixtime := nowTime.Unix()

	if fungus.ReadyTime > uint32(unixtime) {
		return fmt.Errorf("failed to feed ( not Ready )")
	}

	//  2. feedid를 이용하여 먹이의 DNA를 획득
	params := []string{"GetFeed", strconv.Itoa(int(feedid))}
	invokeargs := make([][]byte, len(params))

	for i, arg := range params {
		invokeargs[i] = []byte(arg)
	}

	result := ctx.GetStub().InvokeChaincode("feedfactory", invokeargs, "mychannel")

	if result.Status !=200 {
		return fmt.Errorf("failed to InvokeChincode")
	}

	var feed struct{		
		Dna			uint
	}
	json.Unmarshal(result.Payload, &feed)

	//  3. 버섯DNA와 먹이DNA를 결합하여 새로운 버섯의 DNA를 생성
	err = s._feedAndMultiply(ctx, fungus.Dna, feed.Dna)
	if err !=nil {
		return err
   	}


	// 버섯이 증식되고 나면 소유한 버섯의 숫자count를 증가 시켜야함
	err = s._updateOwnerFungusCount(ctx, fungus.Owner, 1)
	if err != nil {
		return err
   	}

	return nil	
}

func  (s *SmartContract)_feedAndMultiply(ctx contractapi.TransactionContextInterface, fungusDna uint, feedDna uint) error  {
	//  4. 새로운 버섯의 정보들을 모두 입력하여 원장에 저장
	//  버섯 DNA와 먹이 DNA의 평균
	var newDna uint = (fungusDna + feedDna) / 2
	//  평균값의 맨 뒤 두자리를 01로 고정 변환
	newDna = newDna - (newDna % 100) + 1
	//  생성된 DNA로 새 버섯을 생성하여 원장에 저장

	err := s._createFungus(ctx, "noname", newDna)
	if err !=nil {
		return err
   	}

	return nil
}