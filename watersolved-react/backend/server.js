let clickAbleTabIrndices;
let quitERRORfrustrationLevel;
let textFieldElem;
let nameArray;
let hashArray;
let suggestionMenu;
let resultBoxElem;
let visibleCount;
const allowLocalStorage = test_localStorage();
let prependSigWord = false;
if (allowLocalStorage) {
  prependSigWord =
    localStorage.getItem("question_displaySigWord") == null
      ? false
      : localStorage.getItem("question_displaySigWord") === "1";
}

window.onresize = () => {
  correctOverLap(
    document.getElementById("resultBox"),
    document.getElementById("enterChemBox")
  );
};

function test_localStorage() {
  const test = "test";
  try {
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch (e) {
    return false;
  }
}

document.onreadystatechange = () => {
  if (document.readyState === "complete") {
    if (prependSigWord)
      document.getElementById("id_displaySigWordCheckBox").checked = true;
  }
};
function loaded() {
  clickAbleTabIndices = [];
  quitERRORfrustrationLevel = 0;
  // let loadingText = document.getElementById('loadingPlaceHolder');
  // let everythingElse = document.getElementById('container');
  visibleCount = 0;
  // loadingText.style.display = 'none';
  textFieldElem = document.getElementById("chemName");
  suggestionMenu = document.getElementById("selectionMenu");
  suggestionMenu.boolean_isSomethingSelected = false;
  resultBoxElem = document.getElementById("resultBox");
  if (
    !allowLocalStorage ||
    localStorage.getItem("chemNameKeyPairs") == undefined
  ) {
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
      if (this.readyState === 4 && this.status === 200) {
        if (allowLocalStorage) {
          localStorage.setItem("chemNameKeyPairs", xhttp.responseText);
        }
        nameArray = JSON.parse(xhttp.responseText)["chem names"];
        hashArray = JSON.parse(xhttp.responseText)["hashes"];
        // everythingElse.style.display = 'flex';
        nextMeme();
      }
    };
    xhttp.open("GET", "/api/getObjMap", true);
    xhttp.setRequestHeader(
      "x-api-key",
      "0ofGM20ysnaAZ1FMW7IUq7WfANwhacaE20lQsSZY"
    );
    xhttp.send();
  } else {
    nameArray = JSON.parse(localStorage.getItem("chemNameKeyPairs"))[
      "chem names"
    ];
    hashArray = JSON.parse(localStorage.getItem("chemNameKeyPairs"))["hashes"];
    if (nameArray !== undefined) {
      nextMeme();
    } else {
      var xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
          localStorage.setItem("chemNameKeyPairs", xhttp.responseText);
          nameArray = JSON.parse(xhttp.responseText)["chem names"];
          hashArray = JSON.parse(xhttp.responseText)["hashes"];
          nextMeme();
        }
      };
    }
    // everythingElse.style.display = 'flex';
  }
  resultBoxElem.style.display = "none";
}

function nextMeme() {
  if (nameArray.length === 0) {
    alert("RIP LOL UR THING BRKEN GO YELL AT THSI DEV");
  }
  for (let i = 0; i < nameArray.length; i++) {
    let tempStr = reverseString(nameArray[i]);
    tempStr = tempStr
      .replaceAll("000", "/")
      .replaceAll("1111", "-")
      .replaceAll("22222", ".");
    nameArray[i] = reverseString(tempStr)
      .replaceAll("&lt;", "<")
      .replaceAll("&gt;", ">");
    // if(nameArray[i].includes('1-1') || nameArray[i].includes('0-1') || nameArray[i].includes('0-0')){
    //     console.log('rip');
    // }
    let node = document.createElement("LI");
    let linkNode = document.createElement("A");
    let name = document.createTextNode(nameArray[i]);
    linkNode.id = "menu_item_" + i;
    if (linkNode.addEventListener) {
      // all browsers except IE before version 9
      linkNode.addEventListener("click", clickedSuggestion, false);
    } else {
      if (linkNode.attachEvent) {
        // IE before version 9
        linkNode.attachEvent("click", clickedSuggestion);
      }
    }
    linkNode.append(name);
    node.style.display = "list-item";
    node.append(linkNode);
    suggestionMenu.appendChild(node);
  }
}

function optionsClicked() {
  clickAbleTabIndices.length = 0;
  Array.from(document.getElementsByClassName("clickAble")).forEach((item) => {
    clickAbleTabIndices[item.tabIndex] = item;
    // console.log(tabIndices);
    item.tabIndex = -1;
  });
  let popUp = document.getElementById("settingsWindow");
  popUp.style.display = "block";
}

function closeSettings() {
  let canClose = true;
  let hideables = document.getElementsByClassName("hideable");
  Array.from(hideables).forEach((item) => {
    if (item.style.display == "block") {
      // console.log('bad');
      item.style.color = "red";
      canClose = false;
    }
  });
  if (canClose) {
    clickAbleTabIndices.forEach((item, index) => {
      item.tabIndex = index;
      // console.log(index);
    });
    let popup = document.getElementById("settingsWindow");
    popup.style.display = "none";
    Array.from(hideables).forEach((item) => {
      item.style.color = "black";
    });
  }
  if (!canClose) {
    quitERRORfrustrationLevel++;
  }
  if (quitERRORfrustrationLevel > 3) {
    canClose = true;
    quitERRORfrustrationLevel = 0;
    clickAbleTabIndices.forEach((item, index) => {
      item.tabIndex = index;
      // console.log(index);
    });
    let popup = document.getElementById("settingsWindow");
    popup.style.display = "none";
    Array.from(hideables).forEach((item) => {
      item.style.color = "black";
    });
  }
}

window.onclick = function (event) {
  if (event.target === document.getElementById("settingsWindow")) {
    closeSettings();
  }
  if (event.target.id === "chemName" && textFieldElem.value.length > 1) {
    suggestionMenu.style.display = "block";
  }
  if (event.target.id !== "chemName") {
    suggestionMenu.style.display = "none";
  }
  // console.log(event.target.id);
};

document.onkeyup = function (event) {
  switch (event.code) {
    case "Escape":
      if (document.getElementById("settingsWindow").style.display === "block") {
        closeSettings();
      } else {
        optionsClicked();
      }
      break;
    case "ArrowUp":
    case "ArrowDown":
    case "Enter":
      handleListActions(event);
      break;
    default:
    //do nothing for now
  }
};

function handleListActions(event) {
  if (suggestionMenu.style.display === "Block") {
    switch (event.code) {
      case "Enter":
        if (suggestionMenu.boolean_isSomethingSelected) {
        }
        break;
      case "ArrowUp":
      case "ArrowDown":
        suggestionMenu.boolean_isSomethingSelected = true;
        break;
    }
  }
}

var wasLong = false;
var prev = 0;
function textFieldChanged(event) {
  visibleCount = 0;
  let text = textFieldElem.value.toUpperCase();
  textFieldElem.style.color = "black";
  // console.log(text);

  if (!changing) {
    if (text.length <= 0 && prev != 0) {
      shrinkToNone();
      prev = 0;
    }
    if (prev != 1 && !wasLong && text.length > 0 && text.length < 8) {
      growToSmall();
      wasLong = false;
      prev = 1;
    } else if (prev != 1 && wasLong && text.length > 0 && text.length < 8) {
      shrinkToSmall();
      wasLong = false;
      prev = 1;
    } else if (prev != 3 && text.length >= 8) {
      growToLarge();
      prev = 3;
      wasLong = true;
    }
  }

  if (text.length > 1) {
    suggestionMenu.style.display = "block";
    for (let i = 0; i < nameArray.length; i++) {
      let item = document.getElementById("menu_item_" + i);
      // console.log(item.innerHTML);
      if (item.innerHTML.toUpperCase().indexOf(text) > -1) {
        // console.log(item);
        visibleCount++;
        item.style.display = "list-item";
      } else {
        item.style.display = "none";
      }
    }
    if (visibleCount === 1) {
      // suggestionMenu.style.display = "none";
    }
    if (visibleCount === 0) {
      suggestionMenu.style.display = "none";
      textFieldElem.style.color = "red";
      suggestionMenu.boolean_isSomethingSelected = false;
    }
  } else {
    suggestionMenu.style.display = "none";
    suggestionMenu.boolean_isSomethingSelected = false;
  }
}

function clickedSuggestion(event) {
  xhttp_sendApiRequest(event.target.id.split("_")[2]);
}

function xhttp_sendApiRequest(elemID) {
  let finalText = nameArray[elemID];
  for (let i = 0; i < nameArray.length; i++) {
    let item = document.getElementById("menu_item_" + i);
    // console.log(item.innerHTML);
    if (item.innerHTML.toUpperCase().indexOf(finalText) > -1) {
      // console.log(item);
      visibleCount++;
      item.style.display = "list-item";
    } else {
      item.style.display = "none";
    }
  }
  textFieldElem.value = finalText;
  let xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 1) {
      resultBoxElem.style.display = "block";
      document.getElementById("error").style.display = "block";
      document.getElementById("error").innerHTML = "Loading...";
      correctOverLap(
        document.getElementById("resultBox"),
        document.getElementById("enterChemBox")
      );
    }
    if (this.readyState == 4 && this.status == 200) {
      //TODO: need to make the respose ui look better and cleaner

      // console.log(xhttp.responseText);
      // resultBoxElem.innerHTML = JSON.stringify(xhttp.responseText);
      let jsonBody = JSON.parse(xhttp.responseText).body;
      document.getElementById("error").innerHTML = "";
      document.getElementById("error").style.display = "none";
      document.getElementById("chemical_hazard_id").innerHTML = "";
      document.getElementById("chemical_first_aid").innerHTML = "";
      let tempStr = reverseString(jsonBody.ChemName);
      tempStr = tempStr
        .replaceAll("000", "/")
        .replaceAll("1111", "-")
        .replaceAll("22222", ".");
      let chemicalName = reverseString(tempStr)
        .replaceAll("&lt;", "<")
        .replaceAll("&gt;", ">");
      if (chemicalName.toUpperCase().indexOf("SOLUBLE") > -1) {
        document.getElementById("chemical_name").innerHTML =
          chemicalName + "(aq)</br>";
      } else {
        document.getElementById("chemical_name").innerHTML =
          chemicalName + "</br>";
      }
      if (jsonBody.MessyFormula != undefined) {
        document.getElementById("chemical_formula").innerHTML =
          jsonBody.MessyFormula + "</br>";
      } else {
        document.getElementById("chemical_formula").innerHTML =
          "[chemical formula placeholder]</br>";
      }
      // TODO: GET MOLAR MASS of formula
      document.getElementById("chemical_signal_word").innerHTML =
        jsonBody.SignalWord + "</br>";
      let hazIDArray = jsonBody.HazardIdentification;
      for (let i = 0; i < hazIDArray.length; i++) {
        document.getElementById("chemical_hazard_id").innerHTML +=
          hazIDArray[i] + "</br>";
      }
      let firstAidArray = jsonBody.FirstAid;
      for (let i = 0; i < firstAidArray.length; i++) {
        document.getElementById("chemical_first_aid").innerHTML +=
          firstAidArray[i] + "</br>";
      }
      document.getElementById("chemical_ORL_LD").innerHTML =
        jsonBody["-"] + "</br>";
      // console.log(jsonBody);
      let titleBuilder = chemicalName;
      if (prependSigWord) {
        titleBuilder = "[" + jsonBody.SignalWord + "] " + titleBuilder;
      }
      document.title = titleBuilder;
    }
    if (this.readyState == 4 && this.status == 420) {
      resultBoxElem.innerHTML = JSON.stringify(xhttp.responseText);
    }
    if (this.readyState == 4 && this.status == 400) {
      resultBoxElem.innerHTML = "lol this should never happen";
    }
  };
  // console.log(elemID);
  // console.log(+elemID);
  let params = {
    chemID: hashArray[+elemID],
  };
  xhttp.open("GET", "/api/getChemSDS" + formatParams(params), true);
  xhttp.setRequestHeader(
    "x-api-key",
    "0ofGM20ysnaAZ1FMW7IUq7WfANwhacaE20lQsSZY"
  );
  xhttp.send();
  // console.log(event.target.id);
}

function correctOverLap(rect1, rect2) {
  let obj1 = rect1.getBoundingClientRect();
  let obj2 = rect2.getBoundingClientRect();
  if (isOverlap(obj1, obj2)) {
    rect1.style["marginTop"] = "" + (obj2.bottom - obj1.top + 20) + "px";
  }
}

function isOverlap(obj1, obj2) {
  return !(
    obj1.right < obj2.left ||
    obj1.left > obj2.right ||
    obj1.bottom < obj2.top ||
    obj1.top > obj2.bottom
  );
}

String.prototype.replaceAll = function (search, replacement) {
  var target = this;
  return target.replace(new RegExp(search, "g"), replacement);
};

function reverseString(str) {
  return str.split("").reverse().join("");
}

function formatParams(params) {
  return (
    "?" +
    Object.keys(params)
      .map(function (key) {
        return key + "=" + encodeURIComponent(params[key]);
      })
      .join("&")
  );
}

function settingsChanged(target) {
  if (target.name === "question_displaySigWord") {
    prependSigWord = target.checked;
    if (allowLocalStorage) {
      localStorage.setItem("question_displaySigWord", "1");
    }
  }
}

var changing = false;
function growToLarge() {
  document.getElementById("flask").style.animation =
    "waveSmallLarge 7s infinite linear";
  changing = true;
  setTimeout(function () {
    changing = false;
    document.getElementById("flask").style.animation =
      "waveLargeStill 10s infinite linear";
  }, 5500);
}

function shrinkToSmall() {
  changing = true;
  document.getElementById("flask").style.animation =
    "waveLargeSmall 6s infinite linear";
  setTimeout(function () {
    changing = false;
    document.getElementById("flask").style.animation =
      "waveSmallStill 10s infinite linear";
  }, 4500);
}

function growToSmall() {
  changing = true;
  document.getElementById("flask").style.animation =
    "waveNoneSmall 6s infinite linear";
  setTimeout(function () {
    changing = false;
    document.getElementById("flask").style.animation =
      "waveSmallStill 10s infinite linear";
  }, 4900);
}

function shrinkToNone() {
  changing = true;
  document.getElementById("flask").style.animation =
    "waveNone 6s infinite linear";
  setTimeout(function () {
    changing = false;
    document.getElementById("flask").style.animation =
      "waveNonStill 6s infinite linear";
  }, 4500);
}
