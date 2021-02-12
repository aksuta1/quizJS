//1. функционал - перемещение карточки вперед - назад 
//2. проверка на ввод данных 
//3. получение (сбор) данных с карточек
//4. записывать все введенные данные 
//5. реализовать работу прогресс бара 
//6. подсветка рамки для радио и чекбоксов 
// обьект с сохраненными ответами 


var answers = {
  2: null,
  3: null,
  4: null,
  5: null,
}

// движение вперед 
var btnNext = document.querySelectorAll('[data-nav="next"]');
// отслеживаем клик 
btnNext.forEach(function(button){
   button.addEventListener("click", function(){

     // находим текущую карточку
     var thisCard = this.closest("[data-card]");
     var thisCardNumber = parseInt(thisCard.dataset.card);

     // проверяем нужна валидация карточке или нет 
     if (thisCard.dataset.validate == "novalidate"){
     
      navigate("next", thisCard);
      updateProgressBar("next", thisCardNumber);

    } else {
      //при движении вперед сохраняем данные в обьект
      saveAnswer(thisCardNumber, gatherCardData(thisCardNumber));
      //валидация на заполненность 
      if (isFilled(thisCardNumber) && checkOnRequired(thisCardNumber)) {
        navigate("next", thisCard);
        updateProgressBar("next", thisCardNumber);
      } else {
        alert ("Выберите минимум один вариант ответа прежде чем перейти далее.")
      }
    }
  });
});

// движение назад 
var btnPrev = document.querySelectorAll('[data-nav="prev"]');

// отслеживаем клик 
btnPrev.forEach(function(button){
  button.addEventListener("click", function(){
    // находим текущую карточку
    var thisCard = this.closest("[data-card]");
    var thisCardNumber = parseInt(thisCard.dataset.card);

    navigate("prev", thisCard);
    updateProgressBar("prev", thisCardNumber);
  });
});

//создаем функцию для навигации вперед/назад
function navigate(direction, thisCard){

  // находим номер текущей карточки
  var thisCardNumber = parseInt(thisCard.dataset.card);
  var nextCard;

  if (direction == "next"){

    // просчитываем номер следующей карточки
    var nextCard = thisCardNumber +1;
    document.querySelector(`[data-card="${nextCard}"]`).classList.remove("hidden");

  } else if (direction == "prev"){

    var prevCard = thisCardNumber -1;
    document.querySelector(`[data-card="${prevCard}"]`).classList.remove("hidden");
  }
  //переход от текущей карточки к следующей
  thisCard.classList.add("hidden");
}

// функция которая собирает данные из текущей карточки
function gatherCardData(number){

  var question;
  var result = [];

  // находим текущую карточку по номеру и атрибуту
  var currentCard = document.querySelector(`[data-card="${number}"]`);

  //находим главный вопрос карточки
  question = currentCard.querySelector("[data-question]").innerText;
 
  //1.находим все заполненные значения из радио кнопок 
  var radioValues = currentCard.querySelectorAll('[type="radio"]');
  radioValues.forEach(function(item){
    if(item.checked){
      result.push ({
        name: item.name,
        value: item.value 
      });
    }
  });


  //2. находим все заполненные значения из чек боксов
  var checkBoxValues = currentCard.querySelectorAll('[type="checkbox"]');
  checkBoxValues.forEach(function(item){
    
    if(item.checked){
      result.push ({
        name: item.name,
        value: item.value 
      });
    }
  });

   //3. находим все заполненные значения из инпутов
  var inputValues = currentCard.querySelectorAll('[type="text"], [type="email"], [type="number"]');
  inputValues.forEach(function(item){
  itemValue = item.value;

    if (itemValue.trim() != ""){
      result.push ({
       name: item.name,
        value:item.value
      });
    }
  })

  var data = {
    question: question,
    answer:result
  }

  return data

}

//функция записи ответа в обьект с ответами 
function saveAnswer (number, data){
  answers[number] = data;
}

// функция проверки на заполненность (есть в карточке ответы или нет) 
function isFilled(number){
  
  if(answers[number].answer.length > 0){
    return true;
  } else {
    return false;
  }
} 

// функция для проверки email 
function validateEmail (email){
  var pattern = /^[\w-\.]+@[\w-]+\.[a-z]{2,4}$/i;
  return pattern.test(email);
}


// проверка на заполненность required чекбоксов и инпутов с email 
function checkOnRequired(number){
  var currentCard = document.querySelector(`[data-card="${number}"]`);
  var requiredFields = currentCard.querySelectorAll("[required]");
  
  var isValidArray = [];

  requiredFields.forEach(function(item){

    console.dir(item.type);
        console.dir(item.value);
        console.dir(item.checked);

        if ( item.type == "checkbox" && item.checked == false) {
          isValidArray.push(false);
      } else if (item.type == "email" ) {
          if ( validateEmail(item.value)  ) {
              isValidArray.push(true);
          } else {
              isValidArray.push(false);
          }
      }
  }); 
  if (isValidArray.indexOf(false) == -1){
    return true;
  } else {
    return false;
  }
}

// подсвечиваем рамку у радиокнопок 
document.querySelectorAll(".radio-group").forEach(function(item){
  item.addEventListener("click", function(e){
    // проверяем где проводится клик - внутри тега label ли нет 
    var label = e.target.closest("label");
    if (label){
      //отменяем активный класс у всех тегов label
      label.closest(".radio-group").querySelectorAll("label").forEach(function(item){
      item.classList.remove("radio-block--active");
      })
      //добавляем активный клас к label по которому был клик 
      label.classList.add("radio-block--active");
    }
  })
})
 
 // подсвечиваем рамку у чекбоксов
  document.querySelectorAll('label.checkbox-block input[type="checkbox"]').forEach(function(item){
  item.addEventListener('change',function(){
    //если чекбокс проставлен то
    if (item.checked){
      //добавляем активный класс к тегу label в котором он лежит
      item.closest("label").classList.add("checkbox-block--active")
    } else {
      // в ином случае убираем активный класс 
      item.closest("label").classList.remote("checkbox-block--active")
    }
  })
}) 

//отображение прогресс бара 
function updateProgressBar(direction, cardNumber) {
  // Расчет всего кол-ва карточек // 10
  var cardsTotalNumber = document.querySelectorAll("[data-card]").length;

  // Текущая карточка
  // Проверка направления перемещения
  if (direction == "next") {
      cardNumber = cardNumber + 1;
  } else if (direction == "prev") {
      cardNumber = cardNumber - 1;
  }

  // Расчет % прохождения
  var progress = ((cardNumber * 100)/cardsTotalNumber).toFixed();

  // Находим и обновляем прогресс бар
  var progressBar = document.querySelector(`[data-card="${cardNumber}"]`).querySelector("progress");
  if (progressBar) {
      // Обновить число прогресс бара
      progressBar.querySelector(".progress__label strong").innerText = `${progress}%`;

      // Обновить полоску прогресс бара
      progressBar.querySelector(
          ".progress__line-bar"
      ).style = `width: ${progress}%`;
  }
}





  
   

