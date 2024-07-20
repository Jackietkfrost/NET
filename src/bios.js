const biosItems = document.getElementsByClassName('bios-start');
let flickerCount = 0;
let biosCPU;
let counter = 0;
let intervalId;
let counterSpeed = .1;
let counterMax = 2953

function increaseCounter() {
    counter++;
    if (counter >= counterMax) {
      clearInterval(intervalId);
    }
    updateCounterElement(counter);
  }
  
  function updateCounterElement(value) {
    const counterElement = document.getElementById('counter');
    if (counterElement) {
      counterElement.innerText = value.toString();
    } else {
      console.error('Element with id "counter" not found');
    }
  }
  
  function startCounter() {
    counter = 0;
    intervalId = setInterval(increaseCounter, counterSpeed); // Increase counter every 10 milliseconds
  }

/**
 * Function that makes the bios items flicker with a specific delay.
 *
 * @param None
 * @return None
 */
function flickerText() {
    const flickerDelay = 50;
    const nextItemFlickDelay = 2000;
    for (let i = 0; i < biosItems.length; i++) {
        setTimeout(() => {
            for (let j = 0; j < 5; j++) {
                setTimeout(() => {
                    if (flickerCount % 2 === 0) {
                        biosItems[i].style.opacity = 0;
                    } else {
                        biosItems[i].style.opacity = 1;
                    }
                    flickerCount++;
                }, j * flickerDelay); // Delay of 0.2s for each flicker
            }
            setTimeout(() => {
                biosItems[i].style.opacity = 1;
            }, 800); // Delay before setting opacity back to 1
        }, i * nextItemFlickDelay); // Delay before flickering next element
        // TODO: Run a boolean to true to canContinue to load the main page on any key press
        
    }
}

/**
 * Retrieves computer information by calling the `getCPU` function from the `window.netVar` object.
 * The retrieved data is stored in the `biosCPU` variable and logged to the console.
 *
 * @return {undefined} This function does not return a value.
 */
function getComputerInfo() {
    window.netVar.getCPU((_event, serializedData) => {
        biosCPU = serializedData;
        console.log(_event);
        console.log(biosCPU);
    });
    // const parsedCPU = JSON.parse(biosCPU);
    console.log("Got info");
    console.log('bios', biosCPU);
}

function updateCPUElement(parsedCPUInfo) {
    const biosCPUElement = document.getElementById('bios-cpu');
    
    if (biosCPUElement) {
        biosCPUElement.innerText = 'CPU ' + JSON.stringify(parsedCPUInfo.brand, null, 2) + ' at 200MHz';
    } else {
        console.error('Element with id "bios-cpu" not found');
    }
}

window.netVar.getCPU((_event, cpuInfo) => {
    const parsedCPUInfo = JSON.parse(cpuInfo);
    console.log('Received CPU Info:', parsedCPUInfo);
    updateCPUElement(parsedCPUInfo);
    
  });

function startupSound() {
    const startupSound = new Audio('../../assets/sounds/1990s PC Startup Screen.wav');
    startupSound.play();
}
document.addEventListener('DOMContentLoaded', () => {
    // getComputerInfo();
    startupSound();
    flickerText();
    startCounter();
});

