let money = 0;
let codeQuality = 0.05;
let totalChars = 0;
let previousFrameCharCount = 0;
let previousSecondCharCount = 0;
let upgrades = [];
let workers = [];
const txt = document.getElementById("text-input");

document.getElementById("right").style.display = "none";

txt.value = "";
txt.addEventListener("paste", () => {
    alert("bruh");
    window.close();
});

if (window.innerWidth < 1200) {
    document.getElementById("cps-text").textContent = "CPS: ";
    document.getElementById("total-text").textContent = "Total: ";
}

window.addEventListener("resize", () => {
    if (window.innerWidth < 1200) {
        document.getElementById("cps-text").textContent = "CPS: ";
        document.getElementById("total-text").textContent = "Total: ";
    } else {
        document.getElementById("cps-text").textContent = "Characters per second: ";
        document.getElementById("total-text").textContent = "Total Chatacters: ";
    }
});

window.addEventListener("click", () => txt.focus());
window.addEventListener("keydown", () => txt.focus());

class Worker {
    constructor(title, cps, price, workerCodeQuality = 0.05) {
        workers.push(this);
        this.title = title;
        this.price = price;
        this.cps = cps;
        this.workerCodeQuality = workerCodeQuality;
        this.count = 0;

        this.worker_container = document.createElement("div");
        this.worker_container.classList.add("worker-container");

        this.worker_count = document.createElement("h2");
        this.worker_count.classList.add("worker-count");
        this.worker_count.classList.add("jomolhari");
        this.worker_count.textContent = this.count;

        this.worker_btn_container = document.createElement("div");
        this.worker_btn_container.classList.add("worker-btn-container");

        this.worker_title = document.createElement("h3");
        this.worker_title.classList.add("worker-title");
        this.worker_title.textContent = title;

        this.worker_btn = document.createElement("button");
        this.worker_btn.classList.add("worker-btn");
        this.worker_btn.classList.add("jomolhari");
        this.worker_btn.textContent = "$";

        this.worker_price = document.createElement("span");
        this.worker_price.classList.add("jomolhari");
        this.worker_price.textContent = price;

        document.getElementById("workers").appendChild(this.worker_container);
        this.worker_container.appendChild(this.worker_count);
        this.worker_container.appendChild(this.worker_btn_container);
        this.worker_btn_container.appendChild(this.worker_title);
        this.worker_btn_container.appendChild(this.worker_btn);
        this.worker_btn.appendChild(this.worker_price);

        this.worker_btn.addEventListener("click", () => {
            if (this.worker_btn.classList.contains("worker-btn-active")) {
                this.count++;
                this.worker_count.textContent = this.count;
                money -= this.price;
                this.price = price * 1.08 ** this.count;
                this.worker_price.textContent = this.price.toFixed(2);
            }
        });
    }
}

class Upgrade {
    constructor(title, description, price, effect = () => {}) {
        upgrades.push(this);
        this.title = title;
        this.description = description;
        this.price = price;
        this.effect = effect;

        this.upgrade_btn = document.createElement("button");
        this.upgrade_btn.classList.add("upgrade-btn");

        this.upgrade_btn_text = document.createElement("span");
        this.upgrade_btn_text.classList.add("upgrade-btn-text");

        this.upgrade_title = document.createElement("span");
        this.upgrade_title.classList.add("upgrade-title");
        this.upgrade_title.textContent = title;

        this.upgrade_description = document.createElement("span");
        this.upgrade_description.classList.add("upgrade-description");
        this.upgrade_description.textContent = description;

        this.upgrade_price_text = document.createElement("span");
        this.upgrade_price_text.classList.add("upgrade-price-text");
        this.upgrade_price_text.classList.add("jomolhari");
        this.upgrade_price_text.textContent = "$";

        this.upgrade_price = document.createElement("span");
        this.upgrade_price.classList.add("jomolhari");
        this.upgrade_price.textContent = price;

        document.getElementById("upgrades").appendChild(this.upgrade_btn);
        this.upgrade_btn.appendChild(this.upgrade_btn_text);
        this.upgrade_btn_text.appendChild(this.upgrade_title);
        this.upgrade_btn_text.appendChild(this.upgrade_description);
        this.upgrade_btn.appendChild(this.upgrade_price_text);
        this.upgrade_price_text.appendChild(this.upgrade_price);

        this.upgrade_btn.addEventListener("click", () => {
            if (this.upgrade_btn.classList.contains("upgrade-btn-active")) {
                money -= this.price;
                effect();
                this.upgrade_btn.remove();
                upgrades.splice(upgrades.indexOf(this), 1);
            }
        });
    }
}

let typewriterMonkey;
let officeWorker;
let programmer;

let evolution;
let betterTypewriters;

let frameCount = 0;

function update() {
    document.getElementById("money").textContent = money.toFixed(2);

    if (typewriterMonkey) {
        if (typewriterMonkey.count >= 3 && !betterTypewriters) {
            document.getElementById("right").style.display = "flex";
            document.getElementById("middle").style.flex = 1;
            betterTypewriters = new Upgrade("Better Typewriters", "Typewriter monkeys are twice as efficient", 100, () => {
                typewriterMonkey.cps *= 2;
            });
        }
    }
    if (totalChars >= 90000 && !evolution) {
        evolution = new Upgrade("Evolution", "Typewriter monkeys are 100 times more efficient", 9000, () => {
            typewriterMonkey.cps *= 100;
        });
    }
    if (money >= 5 && !typewriterMonkey) {
        typewriterMonkey = new Worker("Typewriter Monkey", 1, 10);
    }
    if (typewriterMonkey) {
        if (typewriterMonkey.count >= 8 && !officeWorker) {
            officeWorker = new Worker("Office Worker", 32, 120);
        }
    }
    if (officeWorker) {
        if (officeWorker.count >= 6 && !programmer) {
            programmer = new Worker("Programmer", 100, 650);
        }
    }

    if (txt.value.length > previousFrameCharCount) {
        totalChars += txt.value.length - previousFrameCharCount;
        document.getElementById("total").textContent = totalChars;
        money += codeQuality * (txt.value.length - previousFrameCharCount);
    }

    for (let i = 0; i < workers.length; i++) {
        if (money >= workers[i].price) {
            workers[i].worker_btn.classList.add("worker-btn-active");
        } else if (workers[i].worker_btn.classList.contains("worker-btn-active")) {
            workers[i].worker_btn.classList.remove("worker-btn-active");
        }
    }

    for (let i = 0; i < upgrades.length; i++) {
        if (money >= upgrades[i].price) {
            upgrades[i].upgrade_btn.classList.add("upgrade-btn-active");
        } else if (upgrades[i].upgrade_btn.classList.contains("upgrade-btn-active")) {
            upgrades[i].upgrade_btn.classList.remove("upgrade-btn-active");
        }
    }

    for (let i = 0; i < workers.length; i++) {
        for (let j = 0; j < workers[i].count; j++) {
            for (let k = 0; k < workers[i].cps; k++) {
                if (Math.random() < 1 / 60) {
                    totalChars++;
                    money += workers[i].workerCodeQuality;
                    txt.value += String.fromCharCode(32 + Math.floor(Math.random() * 95));
                    document.getElementById("total").textContent = totalChars;
                }
            }
        }
    }
    
    if (frameCount % 60 == 0) {
        document.getElementById("cps").textContent = totalChars - previousSecondCharCount;
        previousSecondCharCount = totalChars;
    }

    txt.value = txt.value.slice(-(73*30 + txt.value.length % 73));
    txt.scrollTop = txt.scrollHeight;
    
    previousFrameCharCount = txt.value.length;
    frameCount++;
    requestAnimationFrame(update);
}
requestAnimationFrame(update);
