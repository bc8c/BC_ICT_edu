package chaincode

import (
	"encoding/json"
	"fmt"

	"github.com/hyperledger/fabric-contract-api-go/contractapi"
)

// SmartContract provides functions for managing an Asset
type SmartContract struct {
	contractapi.Contract
}

// Asset describes basic details of what makes up a simple asset
type CarInfo struct {
	ID				string 		`json:"id"`
	Name			string		`json":name"`
	Color			string 		`json:"color"`
	Owner			[]string	`json:"owner"`
	Price			int    		`json:"price"`
	Renter			string		`json:"renter"`
	Expiration		int			`json:"expiration"`
	Available		bool		`json:"available"`
}

type User struct {
	ID				string 		`json:"id"`
	CarList			[]string	`json:carlist`	
}

// 기능리스트업!!  RegisterCar(Name,Color,Price) 

// 차량등록 => 차량id ( 고유번호로 생성 ), 차량이름, 색상, 소유주(등록시에는 null), 가격,
// 현재사용자(등록시에는null), 만료기간 ( 등록시에는 null ), Available (등록시에는 null) 

// 차량구매 파티원을 모집해서 동시에 구매 하도록 ( 관리자가 구매상태를 업데이트 하는 방식으로 처리 )
//.=> 차량 정보의 소유주, 만료기간, Available 을 갱신

// 차량대여기능
// 차량반납기능
