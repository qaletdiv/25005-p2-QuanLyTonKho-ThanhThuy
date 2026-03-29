const account1={
    userId:'nhanvien1',
    userPassword:'nhanvien001'
};

let orders = [
    {
        orderNo:"001",
        vendorName:"Công ty A",
        orderDate:"2025/09/01",
        handler:"Nguyễn Văn A",
        totalAmount:10000,
        status:"Bản nháp",
        orderProducts:[
            {item_CD:"001",item_name:"xi măng",quantity:1,price:5000},
            {item_CD:"002",item_name:"đá nhỏ",quantity:1,price:5000},
        ]
    },
    {
        orderNo:"002",
        vendorName:"Công ty B",
        orderDate:"2025/09/02",
        handler:"Nguyễn Văn B",
        totalAmount:20000,
        status:"Đã xác nhận",
        orderProducts:[
            {item_CD:"003",item_name:"cát",quantity:10,price:1000},
            {item_CD:"004",item_name:"gạch",quantity:10,price:1000},
        ]
    },
    {
        orderNo:"003",
        vendorName:"Công ty C",
        orderDate:"2025/09/03",
        handler:"Nguyễn Văn C",
        totalAmount:50000,
        status:"Đã nhập kho",
        orderProducts:[
            {item_CD:"005",item_name:"mái tôn",quantity:2,price:10000},
            {item_CD:"006",item_name:"dầu máy",quantity:3,price:10000},
        ]
    },
];

let stockData = [
    { item_CD: "001",stock: 1 },
    { item_CD: "002",stock: 2 },
    { item_CD: "003",stock: 3 },
    { item_CD: "004",stock: 4 },
    { item_CD: "005",stock: 5 },
    { item_CD: "006",stock: 6 }
];

let products = [
    { item_CD: "001", item_name: "xi măng",unit:"kg",price:5000 },
    { item_CD: "002", item_name: "đá nhỏ",unit:"kg",price:5000 },
    { item_CD: "003", item_name: "cát",unit:"kg" ,price:1000 },
    { item_CD: "004", item_name: "gạch",unit:"viên",price:1000 },
    { item_CD: "005", item_name: "mái tôn",unit:"tấm",price:10000},
    { item_CD: "006", item_name: "dầu máy",unit:"lít",price:10000 }
];
