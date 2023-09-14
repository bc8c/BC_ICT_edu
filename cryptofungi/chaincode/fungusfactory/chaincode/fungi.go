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

// func (s *SmartContract) Initialize()  {
// 	//  funguscount를 0으로 초기화 시키는 부분
// }

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
	err = _createFunugs(ctx, name, dna)
	if err !=nil {
		return err
   	}

	err = ctx.GetStub().PutState(clientID,[]byte("1"))
	if err !=nil {
		return err
   	}
	return nil
}

func _createFunugs(ctx contractapi.TransactionContextInterface, name string, dna uint) error  {

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