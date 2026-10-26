(function () {
  "use strict";

  var COURSE_FIELDS = [
    "id",
    "name",
    "author",
    "teachers",
    "taskType",
    "readersDay1",
    "readersDay2",
    "hours",
    "minutes"
  ];

  var initialCourses = [
    { id: 101, name: "Літери та читання", author: "Бондар Олена", teachers: ["Коваль Ірина", "Мельник Петро"], taskType: "вибір літери, склади", readersDay1: 48, readersDay2: 52, hours: 8, minutes: 30 },
    { id: 102, name: "Весела математика", author: "Гнатюк Андрій", teachers: ["Лисенко Марія"], taskType: "лічба, приклади", readersDay1: 61, readersDay2: 44, hours: 10, minutes: 0 },
    { id: 103, name: "Англійська для малят", author: "Андрусенко Віра", teachers: ["Smith Anna", "Петренко Олег"], taskType: "картки слів, аудіювання", readersDay1: 39, readersDay2: 41, hours: 9, minutes: 15 },
    { id: 104, name: "Логіка та увага", author: "Савченко Ігор", teachers: ["Ткачук Наталія"], taskType: "головоломки, послідовності", readersDay1: 55, readersDay2: 33, hours: 7, minutes: 45 },
    { id: 105, name: "Світ природи", author: "Кравченко Дарина", teachers: ["Шевчук Богдан", "Романюк Лілія"], taskType: "вікторина, спостереження", readersDay1: 27, readersDay2: 29, hours: 6, minutes: 20 },
    { id: 106, name: "Музичні ігри", author: "Литвин Софія", teachers: ["Дяченко Марко"], taskType: "ритм, повторення мелодії", readersDay1: 34, readersDay2: 38, hours: 5, minutes: 10 },
    { id: 107, name: "Кольори та форми", author: "Олійник Тарас", teachers: ["Білик Катерина"], taskType: "зіставлення, малювання", readersDay1: 72, readersDay2: 19, hours: 4, minutes: 40 },
    { id: 108, name: "Безпека вдома", author: "Мельник Юлія", teachers: ["Гончар Іван", "Сидоренко Оля"], taskType: "ситуації, вибір відповіді", readersDay1: 22, readersDay2: 25, hours: 3, minutes: 55 },
    { id: 109, name: "Казки та мовлення", author: "Павленко Роман", teachers: ["Кузьменко Алла"], taskType: "слухання, переказ", readersDay1: 46, readersDay2: 47, hours: 11, minutes: 5 },
    { id: 110, name: "Перші досліди", author: "Захарченко Ніна", teachers: ["Вовк Сергій"], taskType: "дослід, фіксація результату", readersDay1: 18, readersDay2: 21, hours: 12, minutes: 0 }
  ];

  var courses = copyCourses(initialCourses);

  function copyCourses(list) {
    return list.map(function (course) {
      return {
        id: course.id,
        name: course.name,
        author: course.author,
        teachers: course.teachers.slice(),
        taskType: course.taskType,
        readersDay1: course.readersDay1,
        readersDay2: course.readersDay2,
        hours: course.hours,
        minutes: course.minutes
      };
    });
  }

  function durationMinutes(course) {
    return Number(course.hours) * 60 + Number(course.minutes);
  }

  function formatDuration(totalMinutes) {
    var rounded = Math.round(totalMinutes);
    var hours = Math.floor(rounded / 60);
    var minutes = rounded % 60;
    return hours + " год " + minutes + " хв";
  }

  function interest(course) {
    return (Number(course.readersDay1) + Number(course.readersDay2)) / 2;
  }

  function sortByDuration(list) {
    return list.slice().sort(function (a, b) {
      return durationMinutes(a) - durationMinutes(b);
    });
  }

  function averageInterest(list) {
    if (!list.length) {
      return 0;
    }
    var sum = list.reduce(function (acc, course) {
      return acc + interest(course);
    }, 0);
    return sum / list.length;
  }

  function minReadersDay2Id(list) {
    var minCourse = list.reduce(function (best, course) {
      if (Number(course.readersDay2) < Number(best.readersDay2)) {
        return course;
      }
      return best;
    });
    return minCourse.id;
  }

  function isMissing(value) {
    if (value === null || value === undefined) {
      return true;
    }
    if (typeof value === "number") {
      return Number.isNaN(value);
    }
    if (Array.isArray(value)) {
      return value.length === 0;
    }
    return String(value).trim() === "";
  }

  function courseHasMissingInfo(course) {
    return COURSE_FIELDS.some(function (field) {
      return isMissing(course[field]);
    });
  }

  function insertByAuthor(list, course) {
    var next = list.slice();
    var index = 0;
    while (
      index < next.length &&
      String(next[index].author).localeCompare(course.author, "uk") <= 0
    ) {
      index += 1;
    }
    next.splice(index, 0, course);
    return next;
  }

  function addCourse(list, course) {
    if (courseHasMissingInfo(course)) {
      return [course].concat(list);
    }
    var sortedByAuthor = list.slice().sort(function (a, b) {
      return String(a.author).localeCompare(b.author, "uk");
    });
    return insertByAuthor(sortedByAuthor, course);
  }

  function simultaneousDurations(selected) {
    var factor = selected.length > 3 ? 1.5 : 1;
    return selected.map(function (course) {
      var scaled = durationMinutes(course) * factor;
      return {
        id: course.id,
        name: course.name,
        factor: factor,
        duration: scaled,
        text: formatDuration(scaled)
      };
    });
  }

  function teachersToText(teachers) {
    if (Array.isArray(teachers)) {
      return teachers.join(", ");
    }
    return String(teachers || "");
  }

  function parseTeachers(text) {
    if (!text || !String(text).trim()) {
      return [];
    }
    return String(text)
      .split(",")
      .map(function (item) {
        return item.trim();
      })
      .filter(Boolean);
  }

  function parseOptionalNumber(value) {
    if (value === "" || value === null || value === undefined) {
      return "";
    }
    return Number(value);
  }

  function renderTable(list) {
    var tbody = document.getElementById("courses-lab-body");
    tbody.innerHTML = "";
    list.forEach(function (course) {
      var row = document.createElement("tr");
      row.innerHTML =
        "<td>" + course.id + "</td>" +
        "<td>" + (course.name || "—") + "</td>" +
        "<td>" + (course.author || "—") + "</td>" +
        "<td>" + (teachersToText(course.teachers) || "—") + "</td>" +
        "<td>" + (course.taskType || "—") + "</td>" +
        "<td>" + (course.readersDay1 === "" || course.readersDay1 === undefined ? "—" : course.readersDay1) + "</td>" +
        "<td>" + (course.readersDay2 === "" || course.readersDay2 === undefined ? "—" : course.readersDay2) + "</td>" +
        "<td>" +
          (course.hours === "" || course.minutes === "" || course.hours === undefined || course.minutes === undefined
            ? "—"
            : formatDuration(durationMinutes(course))) +
        "</td>";
      tbody.appendChild(row);
    });
  }

  function renderSelect(list) {
    var box = document.getElementById("courses-select");
    box.innerHTML = "";
    list.forEach(function (course) {
      var label = document.createElement("label");
      var checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.value = String(course.id);
      checkbox.name = "selected-course";
      label.appendChild(checkbox);
      label.appendChild(document.createTextNode(" " + course.id + " — " + (course.name || "без назви")));
      box.appendChild(label);
    });
  }

  function showResult(text) {
    document.getElementById("courses-lab-result").textContent = text;
    console.log(text);
  }

  function refreshView() {
    renderTable(courses);
    renderSelect(courses);
  }

  document.getElementById("btn-sort-duration").addEventListener("click", function () {
    var sorted = sortByDuration(courses);
    courses = sorted;
    refreshView();
    var avg = averageInterest(courses);
    showResult(
      "Курси впорядковано за тривалістю вивчення (від коротших до довших).\n" +
        "Середня кількість користувачів, що цікавляться курсом: " +
        avg.toFixed(2)
    );
  });

  document.getElementById("btn-min-day2").addEventListener("click", function () {
    var complete = courses.filter(function (course) {
      return !isMissing(course.readersDay2);
    });
    if (!complete.length) {
      showResult("Немає курсів із кількістю користувачів за добу_2.");
      return;
    }
    var id = minReadersDay2Id(complete);
    showResult("Внутрішній id курсу з мінімальною кількістю читачів за добу_2: " + id);
  });

  document.getElementById("btn-simultaneous").addEventListener("click", function () {
    var checked = Array.prototype.slice.call(
      document.querySelectorAll('input[name="selected-course"]:checked')
    );
    var ids = checked.map(function (input) {
      return Number(input.value);
    });
    var selected = courses.filter(function (course) {
      return ids.indexOf(Number(course.id)) !== -1 && !isMissing(course.hours) && !isMissing(course.minutes);
    });
    if (!selected.length) {
      showResult("Оберіть хоча б один курс із відомою тривалістю.");
      return;
    }
    var scaled = simultaneousDurations(selected);
    var total = scaled.reduce(function (acc, item) {
      return acc + item.duration;
    }, 0);
    var lines = scaled.map(function (item) {
      return item.name + ": " + item.text;
    });
    var note =
      selected.length > 3
        ? "Обрано більше ніж 3 курси — тривалість кожного збільшено у 1,5 раза."
        : "Обрано до 3 курсів — тривалість кожного не змінюється.";
    showResult(
      note +
        "\n" +
        lines.join("\n") +
        "\nРазом: " +
        formatDuration(total)
    );
  });

  document.getElementById("course-add-form").addEventListener("submit", function (event) {
    event.preventDefault();
    var form = event.target;
    var course = {
      id: parseOptionalNumber(form.id.value),
      name: form.name.value.trim(),
      author: form.author.value.trim(),
      teachers: parseTeachers(form.teachers.value),
      taskType: form.taskType.value.trim(),
      readersDay1: parseOptionalNumber(form.readersDay1.value),
      readersDay2: parseOptionalNumber(form.readersDay2.value),
      hours: parseOptionalNumber(form.hours.value),
      minutes: parseOptionalNumber(form.minutes.value)
    };
    var incomplete = courseHasMissingInfo(course);
    courses = addCourse(courses, course);
    refreshView();
    form.reset();
    showResult(
      incomplete
        ? "Новий курс додано на початок списку, бо відсутня частина інформації."
        : "Новий курс вставлено в список, впорядкований за автором."
    );
  });

  document.getElementById("btn-reset-courses").addEventListener("click", function () {
    courses = copyCourses(initialCourses);
    refreshView();
    showResult("Список курсів повернуто до 10 початкових записів.");
  });

  refreshView();
  showResult("Завантажено 10 записів курсів. Оберіть дію вище.");
})();
