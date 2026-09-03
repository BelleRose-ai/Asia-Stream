// Ad popunder trigger helper
let clickCounter = 0;

export const triggerPopunder = () => {
  clickCounter += 1;
  // Trigger on every tap/click for immediate impression testing
  if (clickCounter % 1 === 0) {
    try {
      const adUrl = 'https://www.highrevenueformat.com/543ef6d342ff74a9f327ef45894dd199';
      
      // Simulate genuine anchor click to bypass strict modern browser window.open blockers
      const a = document.createElement('a');
      a.href = adUrl;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      a.style.display = 'none';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (e) {
      try {
        window.open('https://www.highrevenueformat.com/543ef6d342ff74a9f327ef45894dd199', '_blank');
      } catch (err) {
        // Ignore
      }
    }
  }
};


