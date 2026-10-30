// Multi-Account Pool & Quota Multiplier Simulator in TypeScript

export function initQuotaSimulator(): void {
  const slider = document.getElementById('poolSlider') as HTMLInputElement | null;
  const counter = document.getElementById('poolAccountCounter');
  const simRPM = document.getElementById('simRPM');
  const simTPM = document.getElementById('simTPM');
  const simUptime = document.getElementById('simUptime');

  if (!slider || !counter || !simRPM || !simTPM || !simUptime) return;

  function updateSimulator(): void {
    const count = parseInt(slider!.value, 10);
    counter!.textContent = `${count} Account${count > 1 ? 's' : ''}`;

    const rpm = count * 100;
    const tpm = (count * 1.0).toFixed(1);
    const uptime = count === 1 ? '92.5%' : count < 4 ? '99.5%' : '99.99%';

    simRPM!.textContent = `${rpm} RPM`;
    simTPM!.textContent = `${tpm} M`;
    simUptime!.textContent = uptime;
  }

  slider.addEventListener('input', updateSimulator);
  updateSimulator();
}
