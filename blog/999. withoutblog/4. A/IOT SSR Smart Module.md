##### Modbus Map
- Modbus-RTU over TCP/IP Protocol을 사용 합니다.
- Modvus RTU message가 TCP/IP로 wrap 되어 전송되는 것을 말하며, serial lines 대신 network를 통해 전송되게 됩니다.
- TCP(Transmission Control Procotol)는 전송 제어 프로토콜이고 IP(Internet Protocol) 인터넷 프로토콜 입니다.
- TCP는 Connection 확립되면 Server는 Client가 Connection을 Close 할 때까지 Client의 Qurey(Request)에 응답합니다.
- Server Port 번호는 '502' 입니다.
- 통신프로토콜 - 다음의 기능을 사용할 수 있습니다.

| Function code | Function description | Blocks in registers | Description |
|-|-|-|-|
| 0x03 | Read Holding Registers | 0x100 | 아날로그 설정 값과 메모리를 읽는데 사용|
| 0x04 | Read Input Registers | 0x200 | 아날로그 상태 값(계측 값) 또는 이벤트 값을 읽는데 사용 |
| 0x06 | Write Single Registers | 0x100 | 파라미터 설정하는데 사용 |
| 0x06 | Write Single Registers | | Sub 전체 ON / OFF 명령 |

###### ex 1
- Query code(function code 0x03 으로 Sub 1번 Addr. 0x100 부터 1Point 읽어오기)

| Sub ID | Function | Starting Addr. Hi | Starting Addr. Lo | No. of Point Hi | No. of Point Lo | CRC Hi | CRC Lo |
|-|-|-|-|-|-|-|-|
| 01 | 03 | 0x01 | 00 | 00 | 01 | CRC | CRC

- Response 
(function code 0x03으로 Sub 1번 Addr 0x100 2byte 불러옴. 응답된 데이터는 0x0001로 자동모드)

| Sub ID | Function | Byte Count | Data Hi | Data Lo | CRC Hi | CRC Lo |
|-|-|-|-|-|-|-|
| 01 | 03 |02 | 00 | 01 | CRC | CRC |

###### ex 2) function code 0x06 으로 Sub 1번을 TURN-ON 하려면
| ID | Function | High Addr | High Addr | High Data | Low Data | High CRC | Low CRC |
|-|-|-|-|-|-|-|-|
| 01 | 06 | 01 | 01 | 00 | 01 | CRC | CRC |

###### ex3) function code 0x06 으로 Sub 1번을 TURN-OFF 하려면
| ID | Function | High Addr | High Addr | High Data | Low Data | High CRC | Low CRC |
|-|-|-|-|-|-|-|-|
| 01 | 06 | 01 | 01 | 00 | 00 | CRC | CRC |

##### Holding Register (Function code : 0x03)
- 모든 레지스터는 읽기(R) / 쓰기(W)가 가능합니다.
- 다음 표에 Parameter 설정은 Modbus Function code 0x06 Write Single Register 에 의해 수정될 수 있습니다.

| Func. | Sub I.D | Hex. Addreress | Parameter | Scale | Unit | Allocation of Each Bit | Default |
|-|-|-|-|-|-|-|-|
|0x03|0x01...0xXX|0x100|Operating mode| | | 0=Nomal, 1=Auto | 1 |
|0x03|0x01...0xXX|0x101|Auto mode on/off | | | 0=off, 1=on | 0 |
|0x03|0x01...0xXX|0x012|SSR on/off | | | 0=off, 1=on | 0 |
|0x03|0x01...0xXX|0x103|System on contact on/off | | | 0=off, 1=on| 0|
|0x03|0x01...0xXX|0x104|System off contact on/off | | | 0=off, 1=on | 0|
|0x03|0x01...0xXX|0x105|Auto mode/ system on delay time set | 1 | sec | unsigned int | 4|
|0x03|0x01...0xXX|0x106|Auto mode/ system off SSR off delay time set | 1 | sec | unsigned int | 4 |
|0x03|0x01...0xXX|0x107|Current Alarm set | 1 | % | unsigned int | 100 |
|0x03|0x01...0xXX|0x108|Temp Alarm set | 0.1 | 도C | unsigned int | 60 |
|0x03|0x01...0xXX|0x109|Alarm clear | | | 0=normal, 1=clear | 0 |
|0x03|0x01...0xXX|0x10A|Average Current Per min. | 1 | min | unsigned int | 0 |
|0x03|0x01...0xXX|0x10B|Setting Voltage | 0.1 | V | unsigned int | 0 |
|0x03|0x01...0xXX|0x10C|Clear ES | | | 0=normal, 1=clear| 0 |
|0x03|0x01...0xXX|0x10D|순차 Power On 모드 (ADD 0x254) | | | 0=미사용, 1=사용| 1|
|0x03|0x01...0xXX|0x10E|일괄 Power Off 모드 (ADD 0x255) | | | 0=미사용, 1=사용|1|

##### Read Input Register (Function code : 0x04)
- 모든 레지스터는 읽기(R) 가능합니다.
- 단상 모델의 Current는 R-phase Parameter 입니다.
- Option : Actual Voltage는 전압 측정 기능이 없는 모델은 읽기가 제한 됩니다.

|func.|Sub address|Hex.Address|Data words|Parameter|Scale|Unit|Allocation of Each Bit|
|-|-|-|-|-|-|-|-|
|0x04|0x01...0xXX|0x200|1|Actual Voltage (R-phase)|0.1|V|unsigned int|
|0x04|0x01...0xXX|0x201|1|Actual Voltage (S-phase)|0.1|V|unsigned int|
|0x04|0x01...0xXX|0x202|1|Actual Voltage (T-phase)|0.1|V|unsigned int|
|0x04|0x01...0xXX|0x203|1|Actual Current (R-phase)|0.01|A|unsigned int|
|0x04|0x01...0xXX|0x204|1|Actual Current (S-phase)|0.01|A|unsigned int|
|0x04|0x01...0xXX|0x205|1|Actual Current (T-phase)|0.01|A|unsigned int|
|0x04|0x01...0xXX|0x206|1|제품 내부 온도|0.1|도|unsigned int|
|0x04|0x01...0xXX|0x207|1|알람 상태 0:None, 1:Over Current, 2:Over Temp, 4:Inter Lock (60도 이상시 Output 강제 차단 제품 전원 OFF/ON 하여야 복구 | | | unsigned int|
|0x04|0x01...0xXX|0x208|1|Sub ID | | | unsigend int |
|0x04|0x01...0xXX|0x209|1|Model Name 1:WYIOTG2C15ZF, 2:WYIOTG2C50ZF, 3:WYIOTH3C10ZSJ, 4:WYIOTH3C60ZT, 5:WYIOTH3C60ZT, 6:WYIOTG2C30ZF/SJ/T| | | unsigned int|
|0x04|0x01...0xXX|0x20A|1|Average Current Per min. (R-phase)|0.01|A|unsigned int|
|0x04|0x01...0xXX|0x20B|1|Average Current Per min. (S-phase)|0.01|A|unsigned int|
|0x04|0x01...0xXX|0x20C|1|Average Current Per min. (T-phase)|0.01|A|unsigned int|
|0x04|0x01...0xXX|0x20D|2|ES|0.01|VA|Long inverse|

##### Write Single Registers (Function code : 0x06)
|Function|Sub address|Hex. Address|Parameter|Value|Unit|Allocation of Each Bit|
|-|-|-|-|-|-|-|
|0x06|0xFE, 254|none|Sub 1번부터 n번까지 순차적 POWER ON 모드 (0~10sec)0=0.5sec|1|SEC|unsigned int|
|0x06|0xFE, 255|none|Sub 전체 OFF 모드 | 0 | - | unsigned int|
- 순차 자동 POWER ON 모드는 각 Sub의 Function 0x03의 Address 0x100 옵션에 따라 ON 됩니다.

- ex 1) Query code & Response code
- function code 0x06으로 Sub 1번부터 n번까지 5초 간격 순차적 POWER ON 됩니다.

|Sub ID|Funtion|Starting Addr. Hi|Starting Addr. Lo|No. of Point Hi|No. of Point Lo | CRC Hi|CRC Lo|
|-|-|-|-|-|-|-|-|
|FE|06|00|00|00|05|5D|C6|

- ex 2) Query code & Response code
- function code 0x06으로 Sub 1번부터 n번까지 일괄 POWER OFF 됩니다.

|Sub ID|Funtion|Starting Addr. Hi|Starting Addr. Lo|No. of Point Hi|No. of Point Lo | CRC Hi|CRC Lo|
|-|-|-|-|-|-|-|-|
|FF|06|00|00|00|00|9C|14|

- Write Single Registers (Function code : 0x16)

|Function|Sub address|Hex. Address|Parameter|Value|Unit|Allocation of Each Bit|
|-|-|-|-|-|-|-|
|0x16|0xFE,254|none|Manual on/off disavle setting 0=enable, 1=disable| | SEC | unsigned int|
- 순차 자동 POWER ON 모드는 각 Sub의 Function 0x03의 Address 0x100 옵션에 따라 ON 됩니다.