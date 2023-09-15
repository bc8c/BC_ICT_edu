package chaincode

import ( 
	"github.com/hyperledger/fabric-contract-api-go/contractapi"
	"fmt"
	"strconv"
	"crypto/sha256"
	"time"
	"math"
	"encoding/binary"
	"encoding/json"
)

type SmartContract struct{
	contractapi.Contract
}
type Feed struct{
	FeedId		uint
	Name		string
	Dna			uint
}

func (s *SmartContract) Initialize(ctx contractapi.TransactionContextInterface) error {	
	
	// funguscount 값 읽어오기
	feedscountJSON, err := ctx.GetStub().GetState("feedscount")
	if err !=nil {
		 return err
	}
	if feedscountJSON != nil{
		return fmt.Errorf("feedscount is already set")
	}
	
	//  funguscount를 0으로 초기화 시키는 부분
	err = ctx.GetStub().PutState("feedscount", []byte(strconv.Itoa(0)))
	if err !=nil {
		return err
   	}
	return nil
}

func (s *SmartContract) GetFeed(ctx contractapi.TransactionContextInterface, feedId uint) (*Feed, error)  {
	feedBytes, err := ctx.GetStub().GetState(strconv.Itoa(int(feedId)))
	if err !=nil {
		return nil, err
   	}
	var feed Feed
	err = json.Unmarshal(feedBytes, &feed)
	if err !=nil {
		return nil, err
   	}
	return &feed, nil
}



func (s *SmartContract) CreateRandomFeed(ctx contractapi.TransactionContextInterface, name string) error {
	// DNA를 생성
	dna := s._generateRandomDna(name)
	err := _createFeed(ctx, name, dna)
	if err !=nil {
		return err
   	}
	return nil
}

func _createFeed(ctx contractapi.TransactionContextInterface, name string, dna uint) error  {

	// funguscount 값 읽어오기
	feedscountJSON, err := ctx.GetStub().GetState("feedscount")
	if err !=nil {
		 return err
	}
	feedIdINT,_ := strconv.Atoi(string(feedscountJSON))

	feed := Feed{
		FeedId: uint(feedIdINT) + 1,
		Name: name,
		Dna: dna,
	}
	
	feedJSON, err := json.Marshal(feed)
	if err !=nil {
		return err
   	}
	err = ctx.GetStub().PutState(strconv.Itoa(int(feed.FeedId)), feedJSON )
	if err !=nil {
		return err
   	}

	feedIdINT += 1 
	err = ctx.GetStub().PutState("feedscount", []byte(strconv.Itoa(feedIdINT)))
	if err !=nil {
		return err
   	}

	return nil
}

func (s *SmartContract) _generateRandomDna(name string) uint {

	// 14자리의 숫자
	//  ( 3:3:3:3:2 ) 로 정보가 들어가야한다.
	// 현재시간+입력받은 버섯이름 -> SHA256으로 해시코드생성 -> 숫자로 변환 -> 14자의 숫자로 변환 -> 맨 끝 두지라를 99으로 바꾸면 == DNA

	nowtime := time.Now()
	unixtime := nowtime.Unix()
	data := strconv.Itoa(int(unixtime)) + name // ex> 1694689166myfirstFungus
	hash := sha256.New()
	hash.Write([]byte(data))

	dnaHash := uint(binary.BigEndian.Uint64(hash.Sum(nil)))

	dna := dnaHash % uint(math.Pow(10, 14))
	dna = dna - (dna % 100) + 99

	return dna	
} 
