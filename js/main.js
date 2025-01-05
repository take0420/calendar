'use strict';

console.clear();

{
  const today = new Date();
  let year = today.getFullYear();
  let month = today.getMonth();

  // 汎用関数: 日付オブジェクトを作成
  function createDate(year, month, day) {
    return new Date(year, month, day);
  }

  // 汎用関数: カレンダーの日付データを作成
  function createDateObject(date, isToday, isDisabled) {
    return { date, isToday, isDisabled };
  }

  // 汎用関数: 日付を週ごとに分割
  function splitIntoWeeks(dates) {
    const weeks = [];
    while (dates.length) {
      weeks.push(dates.splice(0, 7));
    }
    return weeks;
  }

  // 汎用関数: 年月タイトルをフォーマット
  function formatTitle(year, month) {
    return `${year}/${String(month + 1).padStart(2, '0')}`;
  }

  // 前月・次月の移動ロジックを汎用化
  function changeMonth(offset) {
    month += offset;
    if (month < 0) {
      year--;
      month = 11;
    } else if (month > 11) {
      year++;
      month = 0;
    }
    createCalendar();
  }

  function getCalendarHead() {
    const dates = [];
    const lastDayOfPrevMonth = createDate(year, month, 0).getDate();
    const firstDayOfThisMonth = createDate(year, month, 1).getDay();

    for (let i = 0; i < firstDayOfThisMonth; i++) {
      dates.unshift(createDateObject(lastDayOfPrevMonth - i, false, true));
    }

    return dates;
  }

  function getCalendarBody() {
    const dates = [];
    const lastDateOfThisMonth = createDate(year, month + 1, 0).getDate();

    for (let i = 1; i <= lastDateOfThisMonth; i++) {
      dates.push(
        createDateObject(
          i,
          year === today.getFullYear() &&
            month === today.getMonth() &&
            i === today.getDate(),
          false
        )
      );
    }

    return dates;
  }

  function getCalendarTail() {
    const dates = [];
    const lastDayOfThisMonth = createDate(year, month + 1, 0).getDay();

    for (let i = 1; i < 7 - lastDayOfThisMonth; i++) {
      dates.push(createDateObject(i, false, true));
    }

    return dates;
  }

  function clearCalendar() {
    const tbody = document.querySelector('tbody');

    while (tbody.firstChild) {
      tbody.removeChild(tbody.firstChild);
    }
  }

  function renderTitle() {
    document.getElementById('title').textContent = formatTitle(year, month);
  }

  function renderWeeks() {
    const dates = [
      ...getCalendarHead(),
      ...getCalendarBody(),
      ...getCalendarTail(),
    ];
    const weeks = splitIntoWeeks(dates);

    weeks.forEach((week) => {
      const tr = document.createElement('tr');
      week.forEach((date) => {
        const td = document.createElement('td');

        td.textContent = date.date;
        if (date.isToday) {
          td.classList.add('today');
        }
        if (date.isDisabled) {
          td.classList.add('disabled');
        }

        tr.appendChild(td);
      });
      document.querySelector('tbody').appendChild(tr);
    });
  }

  function createCalendar() {
    clearCalendar();
    renderTitle();
    renderWeeks();
  }

  // イベントリスナーの登録
  document
    .getElementById('prev')
    .addEventListener('click', () => changeMonth(-1));
  document
    .getElementById('next')
    .addEventListener('click', () => changeMonth(1));
  document.getElementById('today').addEventListener('click', () => {
    year = today.getFullYear();
    month = today.getMonth();
    createCalendar();
  });

  createCalendar();
}
