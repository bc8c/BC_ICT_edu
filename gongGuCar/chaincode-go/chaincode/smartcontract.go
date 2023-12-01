package chaincode

import (
	"encoding/json"
	"fmt"
	"time"
	"strconv"

	"github.com/hyperledger/fabric-contract-api-go/contractapi"
)

// SmartContract provides functions for managing an Asset
type SmartContract struct {
	contractapi.Contract
}

// Asset describes basic details of what makes up a simple asset
type CarInfo struct {
	CID				string 		`json:"cid"`
	Name			string		`json":name"`
	Color			string 		`json:"color"`
	Owner			[]string	`json:"owner"`
	Price			int    		`json:"price"`
	RegDate			int			`json:"regdate`
	Renter			string		`json:"renter"`
	Expiration		int			`json:"expiration"`
	Available		bool		`json:"available"`
}

type User struct {
	UID				string 		`json:"uid"`
	CarList			[]string	`json:carlist`	
}

// RegisterCar(Name,Color,Price) 
// 차량등록 => 차량id ( 고유번호로 생성 ), 차량이름, 색상, 소유주(등록시에는 null), 가격,
// 현재사용자(등록시에는null), 만료기간 ( 등록시에는 null ), Available (등록시에는 null) 
func (s *SmartContract) RegisterCar(ctx contractapi.TransactionContextInterface, uid string, name string, color string, price int) error {

	// 접근제어 (AccessContorl)
	if uid != "admin" {
		return fmt.Errorf("Caller is not admin")
	}

	// 차량 아이디 자동 생성
	assetJSON, err := ctx.GetStub().GetState("CARCOUNT")
	if err != nil {
		return fmt.Errorf("failed to read from world state: %v", err)
	}
	if assetJSON == nil {
		ctx.GetStub().PutState("CARCOUNT", []byte("0"))		
	}
	carcountINT, _ := strconv.Atoi(string(assetJSON))

	carcountINT += 1

	carID := "CAR"+strconv.Itoa(carcountINT)

	// 현재시간 (등록시간) 생성
	nowTime := time.Now()
	unixTime := int(nowTime.Unix())

	// owner 정보에 빈 슬라이스 만들어 할당하기
	owner := make ([]string, 0)

	// 차량정보 데이터 생성
	carinfo := CarInfo{
		CID			: carID,
		Name		: name,
		Color		: color,		
		Price		: price,
		RegDate		: unixTime,
		Available	: false,
		Owner		: owner,
	}

	assetJSON, err = json.Marshal(carinfo)
	if err != nil {
		return err
	}

	ctx.GetStub().PutState("CARCOUNT",[]byte(strconv.Itoa(carcountINT)))
	
	return ctx.GetStub().PutState(carID, assetJSON)
}


// 단일 차량 정보 조회 기능
func (s *SmartContract) QueryCarInfo(ctx contractapi.TransactionContextInterface, carID string) (*CarInfo, error) {
	carAsBytes, err := ctx.GetStub().GetState(carID)

	if err != nil {
		return nil, fmt.Errorf("Failed to read from world state. %s", err.Error())
	}

	if carAsBytes == nil {
		return nil, fmt.Errorf("%s does not exist", carID)
	}

	carInfo := new(CarInfo)
	_ = json.Unmarshal(carAsBytes, carInfo)
	
	return carInfo, nil
}

// 본인 소유 차량 리스트 조회하기
func (s *SmartContract) QueryOwnedCarList(ctx contractapi.TransactionContextInterface, uid string) ([]string, error) {

	listAsBytes, err := ctx.GetStub().GetState(uid)
	if err != nil {
		return nil, fmt.Errorf("Failed to read from world state. %s", err.Error())
	}
	if listAsBytes == nil {
		return nil, fmt.Errorf("Failed to read from world state.")
	}

	user := new(User)
	_ = json.Unmarshal(listAsBytes, user)

	return user.CarList, nil	
}

// 차량구매 파티원을 모집해서 동시에 구매 하도록 ( 관리자가 구매상태를 업데이트 하는 방식으로 처리 )
//.=> 차량 정보의 소유주, 만료기간, Available 을 갱신
func (s *SmartContract) PurchaseCar(ctx contractapi.TransactionContextInterface, uid string, cid string, newOwner string) error {
	// 접근제어 (AccessContorl)
	if uid != "admin" {
		return fmt.Errorf("Caller is not admin")
	}
	carInfo, err := s.QueryCarInfo(ctx, cid)
	if err != nil {
		return err
	}	

	carInfo.Owner = append(carInfo.Owner,newOwner)
	carInfo.Available = true

	assetJSON, err := json.Marshal(carInfo)
	if err != nil {
		return err
	}	
	ctx.GetStub().PutState(cid, assetJSON)
	if err != nil {
		return err
	}	
	
	//  각각의 User 정보에 보유 차량 리스트 추가하기
	listAsBytes, err := ctx.GetStub().GetState(newOwner)
	if err != nil {
		return fmt.Errorf("Failed to read from world state. %s", err.Error())
	}

	user := new(User)
	if listAsBytes != nil {
		_ = json.Unmarshal(listAsBytes, user)
	} else {
		user.UID = newOwner
	}

	user.CarList = append(user.CarList, cid)

	assetJSON, err = json.Marshal(user)
	if err != nil {
		return err
	}
	
	ctx.GetStub().PutState(newOwner, assetJSON)
	if err != nil {
		return err
	}

	return nil
}

// 차량대여기능
func (s *SmartContract) RenteCar(ctx contractapi.TransactionContextInterface, uid string, cid string) error {
	carInfo, err := s.QueryCarInfo(ctx, cid)
	if err != nil {
		return err
	}

	// 접근제어 (AccessContorl) 차량 주인만 가능
	var exist bool = false
	for _, owner := range carInfo.Owner{
		if uid == owner{
			exist = true
		}
	}
	if exist == false {
		return fmt.Errorf("The user does not own the car.")
	}

	// 접근제어 (AccessContorl) 현재 이미 대여중인 차량은 안됨
	if carInfo.Available != true {
		return fmt.Errorf("The car is already being rented.")
	}

	// 현재시간 (등록시간) 생성
	nowTime := time.Now()
	unixTime := int(nowTime.Unix())
	carInfo.Expiration = unixTime + 24*60*60
	carInfo.Available = false
	carInfo.Renter = uid

	assetJSON, err := json.Marshal(carInfo)
	if err != nil {
		return err
	}

	err =ctx.GetStub().PutState(cid, assetJSON)
	if err != nil {
		return err
	}

	return nil
}
// 차량반납기능
func (s *SmartContract) ReturnCar(ctx contractapi.TransactionContextInterface, uid string, cid string) error {
	carInfo, err := s.QueryCarInfo(ctx, cid)
	if err != nil {
		return err
	}

	// 접근제어 (AccessContorl) 본인이 대여중인 차량이 맞는지
	if carInfo.Renter != uid {
		return fmt.Errorf("The car is not a rented car")
	}

	carInfo.Expiration = 0
	carInfo.Available = true
	carInfo.Renter = ""

	assetJSON, err := json.Marshal(carInfo)
	if err != nil {
		return err
	}

	err =ctx.GetStub().PutState(cid, assetJSON)
	if err != nil {
		return err
	}

	return nil
}