// Ad popunder trigger helper
let clickCounter = 0;

export const triggerPopunder = () => {
  clickCounter += 1;
  // Trigger on every 2nd interaction so ad network events fire reliably
  if (clickCounter % 2 === 0) {
    try {
      const windowOpenUrl = 'https://www.highrevenueformat.com/543ef6d342ff74a9f327ef45894dd199';
      // Attempt opening ad in a new background tab
      const newWindow = window.open(windowOpenUrl, '_blank');
      if (newWindow) {
        try {
          newWindow.blur();
          window.focus();
        } catch (e) {
          // Ignore cross-origin blur restrictions
        }
      }
    } catch (e) {
      // Ignore popup restrictions
    }
  }
};


