let days = JSON.parse(localStorage.getItem("ironxDays")) || []
let currentDay = null
let calorieGoal = Number(localStorage.getItem("ironxGoal")) || 0

const daysContainer = document.getElementById("daysContainer")

/* ================= SALVAR ================= */
function save(){
localStorage.setItem("ironxDays", JSON.stringify(days))
}

/* ================= RENDER DIAS ================= */
function render(){

daysContainer.innerHTML = ""

days.forEach((day,i)=>{

if(!day.calories) day.calories = 0
if(!day.proteins) day.proteins = 0
if(!day.workouts) day.workouts = []
if(!day.finished) day.finished = false

const div = document.createElement("div")
div.className = "day"

div.innerHTML = `
<h3>Dia ${i+1}</h3>

<div class="stats">
<span>🔥 ${day.calories} kcal</span>
<span>💪 ${day.proteins} g</span>
</div>

<div class="actions">

<button onclick="openCalories(${i})">Calorias</button>
<button onclick="openProtein(${i})">Proteínas</button>
<button onclick="openWorkout(${i})">Treino</button>
<button onclick="finishDay(${i})">Finalizar</button>

</div>
`

daysContainer.appendChild(div)
})

save()
}

/* ================= NOVO DIA ================= */
document.getElementById("newDayBtn").onclick = ()=>{

days.push({
calories:0,
proteins:0,
workouts:[],
finished:false
})

render()
}

/* ================= CALORIAS ================= */
function openCalories(i){
currentDay = i
document.getElementById("calorieModal").classList.remove("hidden")
}

document.getElementById("saveCalories").onclick = ()=>{

let cal = Number(document.getElementById("foodCalories").value)

if(!cal) return

days[currentDay].calories += cal

document.getElementById("foodCalories").value = ""

closeAll()
render()
}

/* ================= PROTEÍNAS ================= */

const proteinTable = {
maçã:0.3, banana:1.1, pera:0.4, uva:0.6,
morango:0.8, melancia:0.6, melão:0.8,
kiwi:1.1, manga:0.8, mamão:0.5, abacaxi:0.5,
laranja:0.9, abacate:2
}

function openProtein(i){
currentDay = i
document.getElementById("proteinModal").classList.remove("hidden")
}

document.getElementById("addProtein").onclick = ()=>{

let food = document.getElementById("proteinFood").value.toLowerCase().trim()

if(!food) return

let value = proteinTable[food] || 0

days[currentDay].proteins += value

document.getElementById("proteinFood").value = ""

closeAll()
render()
}

/* ================= TREINO ================= */
function openWorkout(i){
currentDay = i
document.getElementById("workoutModal").classList.remove("hidden")
renderWorkouts()
}

document.getElementById("addWorkout").onclick = ()=>{

let input = document.getElementById("workoutInput")
let value = input.value.trim()

if(!value) return

days[currentDay].workouts.push({
name:value,
done:false
})

input.value = ""

renderWorkouts()
render()
}

/* render lista treino */
function renderWorkouts(){

let box = document.getElementById("workoutList")
box.innerHTML = ""

days[currentDay].workouts.forEach((w,i)=>{

box.innerHTML += `
<div style="display:flex;justify-content:space-between;margin:5px 0;">
<span>
<input type="checkbox" onchange="toggleWorkout(${i})" ${w.done ? "checked" : ""}>
${w.name}
</span>
<button onclick="deleteWorkout(${i})">❌</button>
</div>
`
})

}

/* marcar treino */
function toggleWorkout(i){
days[currentDay].workouts[i].done =
!days[currentDay].workouts[i].done

render()
}

/* deletar treino */
function deleteWorkout(i){
days[currentDay].workouts.splice(i,1)
renderWorkouts()
render()
}

/* ================= FINALIZAR DIA ================= */
function finishDay(i){

days[i].finished = true

showSummary(i)

render()
}

/* ================= RESUMO ================= */
function showSummary(i){

let d = days[i]

let done = d.workouts.filter(w=>w.done).length
let total = d.workouts.length

document.getElementById("summaryContent").innerHTML = `

<p>🔥 Calorias: ${d.calories} kcal</p>
<p>💪 Proteínas: ${d.proteins} g</p>
<p>🏋️ Treinos feitos: ${done}/${total}</p>
<p>🎯 Meta: ${d.calories >= calorieGoal ? "BATIDA" : "NÃO BATIDA"}</p>

`

document.getElementById("summaryModal").classList.remove("hidden")
}

/* ================= META ================= */
document.getElementById("calcGoal").onclick = ()=>{

let w = Number(document.getElementById("weight").value)
let h = Number(document.getElementById("height").value)
let a = Number(document.getElementById("age").value)
let g = document.getElementById("gender").value

if(!w || !h || !a) return

let result

if(g === "Homem"){
result = 88.36 + (13.4*w) + (4.8*h) - (5.7*a)
}else{
result = 447.6 + (9.2*w) + (3.1*h) - (4.3*a)
}

calorieGoal = Math.floor(result)

localStorage.setItem("ironxGoal", calorieGoal)

document.getElementById("goalResult").innerHTML =
`Meta: ${calorieGoal} kcal`
}

/* ================= THEME ================= */
document.getElementById("toggleTheme").onclick = ()=>{

document.body.classList.toggle("light-theme")
}

/* ================= RESET ================= */
document.getElementById("reset").onclick = ()=>{

localStorage.clear()
location.reload()
}

/* ================= CLOSE MODALS ================= */
function closeAll(){

document.querySelectorAll(".modal").forEach(m=>{
m.classList.add("hidden")
})

}

document.querySelectorAll(".close").forEach(btn=>{
btn.onclick = ()=>{

let id = btn.dataset.close
document.getElementById(id).classList.add("hidden")

}
})

/* ================= INIT ================= */
render()