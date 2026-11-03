# คู่มือการแปลงโค้ดเครื่องคิดเลข Vanilla HTML/CSS/JS สู่ Next.js (React + TypeScript)

> **วิชา:** CSI205 Front-End Software Development  
> **นักศึกษา:** 68028322 ธนัตถ์ เผื่อนคง  
> **หัวข้อ:** การย้ายและแปลงระบบเครื่องคิดเลขจากสัปดาห์ที่ 3 เข้าสู่ Next.js App Router ในสัปดาห์ที่ 5

---

## 1. บทนำและภาพรวม (Overview)

ในสัปดาห์ที่ 3 (Week 3) เครื่องคิดเลขถูกพัฒนาด้วยเทคโนโลยีพื้นฐาน 3 ไฟล์แยกกัน:
1. `index.html` — โครงสร้างหน้าเว็บและปุ่มกด
2. `index.css` — การจัดรูปแบบ สีสัน ปุ่มกด และเงา (Glassmorphism / Neumorphism)
3. `index.js` — ตัวแปร State Machine, ฟังก์ชันคำนวณ, และ Event Listener

เมื่อนำมาสู่สัปดาห์ที่ 5 (Week 5) ซึ่งเป็นโปรเจกต์ **Next.js 16 (App Router)** ร่วมกับ **React 19** และ **TypeScript** เราจำเป็นต้องแปลงไฟล์เหล่านี้ให้สอดคล้องกับมาตรฐานของ React Component โดยยังคงรักษา **ดีไซน์และฟังก์ชันเดิมไว้ 100%**

---

## 2. ปัญหาที่พบเมื่อคัดลอกโค้ดมาวางตรง ๆ

เมื่อนำโค้ดทั้ง 3 ส่วนมาต่อกันในไฟล์ `app/calculator/page.tsx` ตัวคอมไพเลอร์ของ Next.js (Turbopack) และ TypeScript จะแจ้งเตือนข้อผิดพลาดทันที เพราะ:

1. **Syntax Conflict ในไฟล์ `.tsx`:** ไฟล์ TSX เป็นภาษาผสมระหว่าง TypeScript และ JSX ไม่สามารถใส่โค้ด CSS ดิบ หรือวางคำสั่งนอกรูปแบบฟังก์ชัน React ได้
2. **HTML Attribute ไม่ตรงกับสเปก JSX:** 
   * คำว่า `class="..."` เป็นคำสงวน (Keyword) ใน JavaScript ต้องใช้ `className`
   * การผูก Event แบบ `onclick="..."` หรือ `onsubmit="..."` ที่รับค่าเป็นสตริง ใช้ไม่ได้ใน React
3. **การเข้าถึง DOM ตรง ๆ (DOM Manipulation):** คำสั่งอย่าง `document.getElementById("display").innerText = ...` ขัดแย้งกับ Virtual DOM ของ React ซึ่งต้องการให้ UI เปลี่ยนแปลงผ่าน **State**
4. **CSS รั่วไหล (CSS Leakage):** สไตล์ดั้งเดิมมีการกำหนด `body { ... }` หากนำมาใช้อาจกระทบ Header, Nav Bar และหน้าอื่น ๆ ทั้งหมดในแอปพลิเคชัน

---

## 3. สรุปตารางเปรียบเทียบการเปลี่ยนแปลง (Before vs After)

| หัวข้อ | โค้ดเดิม (Week 3: Vanilla JS) | โค้ดใหม่ (Week 5: Next.js TSX) | คำอธิบาย |
| :--- | :--- | :--- | :--- |
| **ตำแหน่ง CSS** | เขียนใน `index.css` ผูกผ่าน `<link>` | แยกเป็น `calculator.css` นำเข้าด้วย `import "./calculator.css"` | ป้องกันโค้ดปนกับ TSX |
| **สโคปพื้นหลัง** | กำหนดในแท็ก `body { ... }` | กำหนดในคลาส `.calc-page { ... }` | ป้องกันพื้นหลังกระทบหน้าอื่น |
| **คลาสสไตล์** | `class="btn purple"` | `className="btn purple"` | เป็นมาตรฐานของ JSX |
| **Event Submit** | `onsubmit="return false;"` | `onSubmit={(e) => e.preventDefault()}` | ใช้ฟังก์ชันป้องกันการ Refresh |
| **Event ปุ่มกด** | `onclick="NumberClick(7)"` | `onClick={() => NumberClick(7)}` | ส่ง Callback Function ให้ React |
| **Event ฟังก์ชัน** | `onclick="ceClick()"` | `onClick={ceClick}` | ส่ง Function Reference |
| **สัญลักษณ์พิเศษ** | `&divide;`, `&times;`, `&Sqrt;` | `÷`, `×`, `√` | ใช้สัญลักษณ์ Unicode แท้ใน JSX |
| **การแสดงผล** | `document.getElementById(...).innerText` | `useState` ควบคุม `{insertSeperator(display)}` | อัปเดตผ่าน Virtual DOM |
| **ตัวแปรคำนวณ** | ตัวแปร Global `let state, first, second...` | `useRef<CalcState>(...)` | เก็บค่าต่อเนื่อง ไม่เกิด Stale Closure |
| **Keyboard Event** | `document.addEventListener("keydown", ...)` | ครอบใน `useEffect(..., [])` พร้อมถอด Event | ป้องกัน Memory Leak ใน React |

---

## 4. เจาะลึกรายละเอียดเชิงสถาปัตยกรรม (Architecture Details)

### 4.1 การแยกสไตล์ CSS (`calculator.css`)
ย้าย CSS เดิมทั้งหมดมาไว้ที่ `calculator.css` โดยปรับเปลี่ยนจุดสำคัญ:
```css
/* ครอบด้วย .calc-page แทนการใช้ body */
.calc-page {
  min-height: calc(100vh - 120px);
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  box-sizing: border-box;
}

.calc-page * {
  box-sizing: border-box;
}
```
* ส่วนของปุ่มกด (`.btn`, `.purple`, `.green`, `.btn-equal`, `.btn-func`, `.btn-mem`) และหน้าจอ (`.display`) คงสไตล์เดิมไว้ทั้งหมด

---

### 4.2 การจัดการ State ด้วย `useRef` ร่วมกับ `useState`

#### ปัญหาคลาสสิกของ React:
หากเราแปลงตัวแปร `state`, `first`, `second`, `operator`, `isResult` ไปเป็น `useState` ทั้งหมด จะพบปัญหาเมื่อคำนวณหลายขั้นตอนติดกัน เช่น:
```
กด: 5  ➔  กด: +  ➔  กด: 3  ➔  กด: +
```
ในฟังก์ชัน `operandClick`:
```javascript
case "second":
  second = Number(display);
  const res = calculate(first, operator, second);
  display = String(res);
  first = Number(res); // ถ้าใช้ setState ตรงนี้ ค่าจะไม่เปลี่ยนทันที!
  operator = op;
  state = "operator";
```
เพราะการทำงานของ `setState` ใน React เป็น **Asynchronous & Batched** หากอ่านค่าในฟังก์ชันเดียวกันทันที จะได้ค่าเก่า (Stale State)

#### วิธีแก้ไขที่ถูกต้อง:
* ใช้ **`useRef`** เก็บสถานะการคำนวณภายใน (`calcRef.current`):
  ทำให้ค่าเปลี่ยนแปลงทันทีแบบ Synchronous แม่นยำ 100% ตาม Logic เดิมของ JavaScript
* ใช้ **`useState`** เฉพาะตัวแปร `display` สำหรับสะท้อนค่าออกสู่หน้าจอ:
  ```tsx
  const calcRef = useRef<CalcState>({
    state: "first",
    display: "0",
    first: 0,
    second: 0,
    operator: "",
    isResult: false,
  });

  const [display, setDisplay] = useState("0");
  ```
* เมื่อคำนวณเสร็จในแต่ละ Event ให้เรียก `setDisplay(calcRef.current.display)` เพื่อให้ React ทำการวาดหน้าจอใหม่

---

### 4.3 การเชื่อมต่อ Keyboard Event ด้วย `useEffect`
ในระบบ Single Page Application (SPA) ของ Next.js หากผูก Event Listener กับ `window` หรือ `document` โดยตรง Event จะคงอยู่แม้ผู้ใช้จะเปลี่ยนไปหน้าอื่น (เช่น หน้า Todos หรือ หน้าแรก)

การนำมาใส่ใน `useEffect` ช่วยให้สามารถทำ **Clean-up** ได้อย่างถูกต้อง:
```tsx
useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Enter" || e.key === "=") equalsClick();
    else if (e.key === "Escape") ceClick();
    else if (e.key >= "0" && e.key <= "9") NumberClick(e.key);
    else if (e.key === "-") operandClick("-");
    else if (e.key === "+") operandClick("+");
    else if (e.key === "*") operandClick("*");
    else if (e.key === "/") operandClick("/");
  };

  window.addEventListener("keydown", handleKeyDown);

  // Clean-up function เมื่อผู้ใช้ออกจากหน้า Calculator
  return () => {
    window.removeEventListener("keydown", handleKeyDown);
  };
}, []);
```

---

### 4.4 ฟังก์ชันจัดรูปแบบตัวเลข (`insertSeperator`)
คง Logic เดิมในการใส่เครื่องหมายจุลภาค (Comma `,`) ทุก ๆ 3 หลักจากขวาไปซ้าย พร้อมรองรับทศนิยมและค่าติดลบ:
```tsx
const insertSeperator = (str: string, separator = ",", groupSize = 3) => {
  let integerPart = str;
  let isNegative = false;

  if (integerPart.startsWith("-")) {
    isNegative = true;
    integerPart = integerPart.slice(1);
  }

  let decimalPart = "";
  if (integerPart.includes(".")) {
    const parts = integerPart.split(".");
    integerPart = parts[0];
    decimalPart = "." + parts[1];
  }

  let result = "";
  let counter = 0;

  for (let i = integerPart.length - 1; i >= 0; i--) {
    result = integerPart[i] + result;
    if (i !== 0 && counter++ % groupSize === groupSize - 1) {
      result = separator + result;
    }
  }

  if (isNegative) result = "-" + result;
  return result + decimalPart;
};
```

---

## 5. โครงสร้างไฟล์ในโฟลเดอร์ Calculator

```text
app/
└── calculator/
    ├── page.tsx          # Component หลักสำหรับแสดงผลและ Logic คำนวณ (Client Component)
    ├── calculator.css    # ไฟล์สไตล์เฉพาะของหน้าเครื่องคิดเลข
    └── README.md         # คู่มือและเอกสารอธิบายการแปลงโค้ด
```

---

## 6. สรุปผลลัพธ์ (Summary)

1. **ความเข้ากันได้ (Compatibility):** ผ่านการตรวจสอบไวยากรณ์ด้วย TypeScript (`npx tsc --noEmit`) 0 Errors
2. **ดีไซน์ดั้งเดิม:** ปุ่มกด, ฟอนต์ Consolas สำหรับตัวเลข, แอนิเมชันปุ่มตอน Hover/Active, และข้อมูลนักศึกษา `68028322 ธนัตถ์ เผื่อนคง` แสดงผลถูกต้อง
3. **การใช้งาน (Usability):** ใช้งานได้สมบูรณ์ทั้งการคลิกปุ่มบนหน้าจอ และการพิมพ์ผ่านคีย์บอร์ด
