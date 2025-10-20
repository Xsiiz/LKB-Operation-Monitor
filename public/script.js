// --------------------
// 🕒 กำหนดวันเริ่มต้นและเวลา ณ ตอนนี้
// --------------------
const startDate = "2026-01-04";
const now = new Date();

// ผูกเวลาเริ่มต้นกับวันที่ที่ต้องการ
const runTime = new Date(startDate + "T" +
  now.getHours().toString().padStart(2, '0') + ":" +
  now.getMinutes().toString().padStart(2, '0') + ":" +
  now.getSeconds().toString().padStart(2, '0')
);

// ⏱ เก็บเวลาที่ Server เริ่มรัน (ใช้เป็นฐานในการนับเวลา)
const serverStartTime = new Date();

// --------------------
// 📦 โหลดข้อมูลและแสดงผล
// --------------------
async function loadData() {
  const res = await fetch("/api/mock");
  const jobs = await res.json();
  renderTable(jobs);
  setInterval(() => renderTable(jobs), 1000);
}

function renderTable(jobs) {
  const tbody = document.getElementById("jobBody");
  tbody.innerHTML = "";

  jobs.forEach(job => {
    const allDone =
      job.packing.endTime && job.checking.endTime && job.loading.endTime;

    ["packing", "checking", "loading"].forEach((op, i) => {
      const task = job[op];
      const tr = document.createElement("tr");

      const bgColor = !task.startTime
        ? "bg-gray-100"
        : task.endTime
          ? "bg-green-100"
          : "bg-orange-100";

      const borderColor = "border-blue-900";

      // 🧮 คำนวณเวลา Duration
      let duration;
      if (task.endTime != null) {
        duration = task.startTime
          ? getElapsed(task.startTime, task.endTime)
          : "-";
      } else {
        // 🟢 ถ้ายังไม่จบงาน → ให้นับจากเวลาที่ Server เริ่มรัน
        const diff = Math.floor((new Date() - serverStartTime) / 1000);
        const safeDiff = diff > 0 ? diff : 1; // เริ่มจาก 1 วินาทีเสมอ
        duration = getElapsed(0, safeDiff * 1000);
      }

      tr.className = `${bgColor} ${borderColor} border-t`;

      tr.innerHTML = `
        ${op === "packing"
          ? `<td class="p-3 border border-orange-800 font-bold text-blue-900" rowspan="3">${job.job}</td>`
          : ""}
        <td class="p-3 border border-orange-800 capitalize text-blue-900 font-semibold">${op}</td>
        <td class="p-3 border border-orange-800">${task.worker || "-"}</td>
        <td class="p-3 border border-orange-800">${task.startTime ? formatTime(task.startTime) : "-"}</td>
        <td class="p-3 border border-orange-800">${task.endTime ? formatTime(task.endTime) : "-"}</td>
        <td class="p-3 border border-orange-800 ${!task.startTime
          ? "text-gray-400"
          : task.endTime
            ? "text-green-700 font-semibold"
            : "text-orange-700 font-semibold"
          }">
          ${!task.startTime && !task.endTime
            ? "-" // ถ้าไม่มีทั้ง start และ end
            : duration
          }
        </td>
        ${op === "packing"
          ? `<td class="p-3 border border-orange-800 text-center font-semibold text-lg" rowspan="3">
              ${allDone
            ? `<span class='text-green-600'>✅</span>`
            : `<span class='text-orange-600'>⏳</span>`}
            </td>`
          : ""}
      `;
      tbody.appendChild(tr);
    });
  });
}

// --------------------
// 🕒 Helper Functions
// --------------------
function formatTime(t) {
  const d = new Date(t);
  return d.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  });
}

function getElapsed(startTime, endTime) {
  const diff = Math.floor((new Date(endTime) - new Date(startTime)) / 1000);
  const h = Math.floor(diff / 3600);
  const m = Math.floor((diff % 3600) / 60);
  const s = diff % 60;
  return `${h}h ${m}m ${s}s`;
}

loadData();
