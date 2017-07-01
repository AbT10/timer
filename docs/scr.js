// Service worker registration
let reg;

window.onload = ()=>{
	if(navigator.serviceWorker){
		console.log("Registering Service Worker!");
		reg = navigator.serviceWorker.register('sw2.js')
		.then((r)=>{
			console.log("Successfully Registered Service Worker!" + r);
		})
		.catch((err)=>{
			console.log("An Error Occured while registering service worker.");
		});
}
}

const zone = document.getElementById("time_zone");
let timers = [];
const activ_timrs = document.getElementsByClassName("timer");

const add_timer = document.getElementById("add_timer");
add_timer.addEventListener("click",_=>{
	toggle_form();
});

const time_config = document.getElementById("form");

const submit = document.getElementById("submit");
submit.addEventListener("click",_=>{
	get_vals();
	if(get_vals) toggle_form();
});

class Timers{
	constructor({hrs=0,min=0,sec=0,color="#008382",title = "New Timer"}){
		this.hrs = hrs;
		this.min = min;
		this.sec = sec;
		this.id = `timers_no.${timers.length}`;
		this.clr = color;
		this.finished = false;
		this.state = true;
		this.title = title;
		this.set_time(min,sec);
		this.create_timer();
		check_class();
		this.update_time();
	}

	set_time(min,sec){
		if(this.min >=60){
			this.hrs += Math.floor(this.min/60);
			this.min -= (Math.floor(this.min/60))*60;
		}
		if(this.sec >=60){
			this.min += Math.floor(this.sec/60);
			this.sec -= (Math.floor(this.sec/60))*60;
		}
	}

	create_timer(){
		let div = document.createElement("div"),
		ttl = document.createElement("div"),
		tmz = document.createElement("div"),
		sec = document.createElement("p"),
		min = document.createElement("p"),
		hrs = document.createElement("p"),
		title = document.createElement("p"),
		close = document.createElement("button");

		close.innerHTML = "<i class='material-icons'>close</i>";
		hrs.innerHTML = this.hrs ? ((this.hrs < 10) ? `0${this.hrs}:` : `${this.hrs}:`) : '00:';
		min.innerHTML = this.min ? ((this.min < 10) ? `0${this.min}:` : `${this.min}:`) : '00:';
		sec.innerHTML = this.sec ? ((this.sec < 10) ? `0${this.sec}` : this.sec) : '00';
		title.innerHTML = this.title;
		
		hrs.id = this.id + "_hrs";
		min.id = this.id + "_min";
		sec.id = this.id + "_sec";
		title.id = this.id + "_title";
		close.id = this.id + "_close";

		hrs.className = min.className = sec.className = "timd";
		ttl.className = "titl";
		tmz.className = "tz";
		close.className = "btn";
		close.setAttribute("onclick","end(this)");

		ttl.appendChild(title);
		tmz.appendChild(hrs);
		tmz.appendChild(min);
		tmz.appendChild(sec);

		div.appendChild(close);
		div.appendChild(ttl);
		div.appendChild(tmz);
		
		
		div.id = this.id;
		div.style.backgroundColor = this.clr;
		div.classList.add("timer");
		div.setAttribute("onclick","toggle_timer(this)");
		zone.appendChild(div);
	}

	display(){
		let hr = document.getElementById(`${this.id}_hrs`);
		let min = document.getElementById(`${this.id}_min`);
		let sec = document.getElementById(`${this.id}_sec`);


		hr.innerHTML = (this.hrs < 10) ? `0${this.hrs}:` : `${this.hrs}:`;
		min.innerHTML = (this.min < 10) ? `0${this.min}:` : `${this.min}:`;
		sec.innerHTML = (this.sec < 10) ? `0${this.sec}` : this.sec;
	}

	update_time(){
		if(this.finished || !this.state){
			clearInterval(this.timer);
			return;
		}
		let timer = setInterval(_=>{
			if(this.min !== 0 || this.sec !== 0 || this.hrs !== 0){
				if(this.sec === 0 && this.min !== 0){
					this.sec = 59;
					this.min--;
				}
				else if((this.min === 0 && this.sec === 0) && this.hrs !== 0){
					this.hrs--;
					this.min = 59;
					this.sec = 59;
				}
				else{
					this.sec--;
				}
			}
			else{
				this.finished = true;
				this.state = false;
				return;
			}
			this.display();
		},1000);
		this.timer = timer;
	}

}


function get_vals(){
	let hrs = document.getElementById("hrs").value ? parseInt(document.getElementById("hrs").value) : 0;
	let min = document.getElementById("mins").value ? parseInt(document.getElementById("mins").value) : 0;
	let sec = document.getElementById("secs").value ? parseInt(document.getElementById("secs").value) : 0;
	let title = document.getElementById("title").value ? document.getElementById("title").value : "Stuff";
	if(hrs || min || sec){
		timers.push(new Timers({hrs,min,sec,title: title}));
		if(timers.length > 1){
			zone.classList.remove("solo");
		}
	}
	else{
		return false;
	}
}

function toggle_form(){
	time_config.style.display = time_config.style.display === "flex" ? "none" : "flex"; 
}

function check_class(){
	if(zone.className !== "solo"){
		for(let i=0; i<activ_timrs.length; i++){
			if(activ_timrs[i].classList.contains("solo")){
				activ_timrs[i].classList.remove("solo");
				activ_timrs[i].classList.add("timr");
			}
		}
	}
}

function toggle_timer(e){
	for(let i=0; i<activ_timrs.length; i++){
		if(e === activ_timrs[i]){
			timers[i].state = !timers[i].state;
			timers[i].update_time();
		}
	}
}

function end(i){
	let clo = document.getElementsByClassName("btn"),
	ele;
	for(let j=0; j<clo.length; j++){
		if(clo[j] === i){
			ele = clo[j].parentNode;
			timers[j].hrs = timers[j].min = timers[j].sec = 0;
			timers[j].finished = true;
			timers[j].state = false;
			timers[j] = null;
		}
	}
	zone.removeChild(ele);
	timers = timers.filter(k=> k!= null);
	if(timers.length === 1){
		zone.className = "solo";
		timers[0].classList.remove("timr");
		timers[0].classList.add("solo");
	}
}