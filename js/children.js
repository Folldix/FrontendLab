(function () {
  "use strict";

  function ChildAccount(data) {
    this.lastName = data.lastName;
    this.firstName = data.firstName;
    this.age = Number(data.age);
    this.email = data.email;
    this.goal = data.goal;
    this.date = data.date;
    this.time = data.time;
  }

  ChildAccount.prototype.fullName = function () {
    return this.lastName + " " + this.firstName;
  };

  ChildAccount.prototype.monthNumber = function () {
    return Number(this.date.slice(5, 7));
  };

  ChildAccount.prototype.ageClass = function () {
    if (this.age <= 3) {
      return "early";
    }
    if (this.age > 3 && this.age < 5) {
      return "middle";
    }
    if (this.age >= 5 && this.age <= 7) {
      return "preschool";
    }
    return "school";
  };

  function ChildRegistry(accounts) {
    this.accounts = accounts.slice();
  }

  ChildRegistry.prototype.byMonthAndTime = function (month, time) {
    var monthNumber = Number(month);
    return this.accounts.filter(function (child) {
      var sameMonth = child.monthNumber() === monthNumber;
      var sameTime = !time || child.time === time;
      return sameMonth && sameTime;
    });
  };

  ChildRegistry.prototype.minAgeInfo = function () {
    return this.accounts.reduce(function (youngest, child) {
      if (child.age < youngest.age) {
        return child;
      }
      return youngest;
    });
  };

  ChildRegistry.prototype.countByAgeClass = function () {
    return this.accounts.reduce(
      function (counts, child) {
        counts[child.ageClass()] += 1;
        return counts;
      },
      { early: 0, middle: 0, preschool: 0, school: 0 }
    );
  };

  ChildRegistry.prototype.sortedByEmail = function () {
    return this.accounts.slice().sort(function (a, b) {
      return a.email.localeCompare(b.email, "uk", { sensitivity: "base" });
    });
  };

  var registry = new ChildRegistry([
    new ChildAccount({ lastName: "Шевченко", firstName: "Марко", age: 8, email: "marko.shev@example.com", goal: "пропозиція", date: "2026-01-12", time: "09:15" }),
    new ChildAccount({ lastName: "Коваль", firstName: "Софія", age: 5, email: "sofia.koval@example.com", goal: "співпраця", date: "2026-03-04", time: "14:30" }),
    new ChildAccount({ lastName: "Бондар", firstName: "Лев", age: 3, email: "lev.bondar@example.com", goal: "наявність помилки", date: "2026-03-18", time: "11:00" }),
    new ChildAccount({ lastName: "Мельник", firstName: "Анна", age: 6, email: "anna.melnyk@example.com", goal: "скарга на неякісний контент", date: "2026-05-02", time: "16:45" }),
    new ChildAccount({ lastName: "Ткачук", firstName: "Олег", age: 4, email: "oleh.tkachuk@example.com", goal: "пропозиція", date: "2026-05-21", time: "10:20" }),
    new ChildAccount({ lastName: "Лисенко", firstName: "Міла", age: 2, email: "mila.lysenko@example.com", goal: "співпраця", date: "2026-07-09", time: "13:10" }),
    new ChildAccount({ lastName: "Романюк", firstName: "Данило", age: 7, email: "danylo.rom@example.com", goal: "наявність помилки", date: "2026-07-09", time: "18:00" }),
    new ChildAccount({ lastName: "Гончар", firstName: "Емілія", age: 9, email: "emilia.honchar@example.com", goal: "пропозиція", date: "2026-09-15", time: "09:15" }),
    new ChildAccount({ lastName: "Павленко", firstName: "Тимур", age: 10, email: "tymur.pav@example.com", goal: "співпраця", date: "2026-10-03", time: "12:40" }),
    new ChildAccount({ lastName: "Сидоренко", firstName: "Катерина", age: 1, email: "katya.syd@example.com", goal: "скарга на неякісний контент", date: "2026-10-21", time: "15:05" })
  ]);

  var CLASS_LABELS = {
    early: "ранній (до 3-х років включно)",
    middle: "середній (від 3 до 5)",
    preschool: "дошкільний (5–7 років)",
    school: "шкільний (більше 7 років)"
  };

  function renderTable(list) {
    var tbody = document.getElementById("children-lab-body");
    tbody.innerHTML = "";
    list.forEach(function (child) {
      var row = document.createElement("tr");
      row.innerHTML =
        "<td>" + child.lastName + "</td>" +
        "<td>" + child.firstName + "</td>" +
        "<td>" + child.age + "</td>" +
        "<td>" + child.email + "</td>" +
        "<td>" + child.goal + "</td>" +
        "<td>" + child.date + "</td>" +
        "<td>" + child.time + "</td>";
      tbody.appendChild(row);
    });
  }

  function showResult(text) {
    document.getElementById("children-lab-result").textContent = text;
    console.log(text);
  }

  function formatChildLine(child) {
    return child.fullName() + ", " + child.age + " р., " + child.email + ", " + child.date + " " + child.time + ", мета: " + child.goal;
  }

  document.getElementById("btn-filter-month").addEventListener("click", function () {
    var month = document.getElementById("filter-month").value;
    var time = document.getElementById("filter-time").value;
    if (!month) {
      showResult("Оберіть місяць звернення.");
      return;
    }
    var found = registry.byMonthAndTime(month, time);
    if (!found.length) {
      showResult("За обраними місяцем і часом звернень немає.");
      return;
    }
    showResult(
      "Діти, батьки яких звернулись у обраний місяць" +
        (time ? " о " + time : "") +
        ":\n" +
        found.map(formatChildLine).join("\n")
    );
  });

  document.getElementById("btn-min-age").addEventListener("click", function () {
    var child = registry.minAgeInfo();
    showResult(
      "Мінімальний вік: " +
        child.age +
        "\nE-mail: " +
        child.email +
        "\nДата звернення: " +
        child.date
    );
  });

  document.getElementById("btn-age-classes").addEventListener("click", function () {
    var counts = registry.countByAgeClass();
    showResult(
      "Кількість дітей за віковими класами:\n" +
        CLASS_LABELS.early + ": " + counts.early + "\n" +
        CLASS_LABELS.middle + ": " + counts.middle + "\n" +
        CLASS_LABELS.preschool + ": " + counts.preschool + "\n" +
        CLASS_LABELS.school + ": " + counts.school
    );
  });

  document.getElementById("btn-sort-email").addEventListener("click", function () {
    var sorted = registry.sortedByEmail();
    showResult(
      "Сортування за E-mail (алфавітний порядок) і мета зворотнього зв’язку:\n" +
        sorted
          .map(function (child) {
            return child.email + " — " + child.goal;
          })
          .join("\n")
    );
  });

  renderTable(registry.accounts);
  showResult("Завантажено 10 облікових записів дітей. Оберіть дію вище.");
})();
