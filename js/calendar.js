function renderCountdown(el, targetISO) {
  const targetDate = new Date(targetISO);
  const now = new Date();
  const diff = targetDate - now;

  if (diff <= 0) {
    el.innerHTML = `
      <span class="text-4xl opacity-50">0d</span>
      <span class="text-3xl opacity-30">0h</span>
      <span class="text-2xl opacity-20">0m</span>
    `;
    return;
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);

  el.innerHTML = `
    <span class="text-4xl opacity-50">${days}d</span>
    <span class="text-3xl opacity-30">${hours}h</span>
    <span class="text-2xl opacity-20">${minutes}m</span>
  `;
}

const countdowns = [
  { id: "countMerida", target: "2026-10-22T00:00:00-03:00" },
  { id: "count2ndEnterprise", target: "2026-01-10T00:00:00-03:00" },
  { id: "countInstalaciones", target: "2026-02-04T00:00:00-03:00" },
  { id: "countEdificios", target: "2026-02-09T00:00:00-03:00" },
  { id: "countFeb14", target: "2026-02-14T00:00:00-03:00" },
  { id: "countMar30", target: "2026-03-31T00:00:00-03:00" },
  { id: "countMay1", target: "2026-05-01T00:00:00-03:00" },
];

function updateAllCountdowns() {
  countdowns.forEach(c => {
    const el = document.getElementById(c.id);
    if (!el) return;
    renderCountdown(el, c.target);
  });
}

updateAllCountdowns();
setInterval(updateAllCountdowns, 60 * 1000);