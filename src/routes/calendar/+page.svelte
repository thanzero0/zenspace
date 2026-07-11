<script>
    import { onMount } from 'svelte';
    import { fade } from 'svelte/transition';

    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    /** @type {any} */

    let date = $state(new Date());
    /** @type {any} */
    let currentMonth = $state(date.getMonth());
    /** @type {any} */
    let currentYear = $state(date.getFullYear());

    /** @type {any} */

    let calendarDays = $state([]);

    function renderCalendar() {
        date.setDate(1);
        const firstDayIndex = date.getDay();
        const lastDay = new Date(currentYear, currentMonth + 1, 0).getDate();
        const prevLastDay = new Date(currentYear, currentMonth, 0).getDate();
        const lastDayIndex = new Date(currentYear, currentMonth + 1, 0).getDay();
        const nextDays = 7 - lastDayIndex - 1;

        /** @type {any} */

        let daysArray = $state([]);

        // Previous month days
        for (let x = firstDayIndex; x > 0; x--) {
            daysArray.push({
                day: prevLastDay - x + 1,
                isPrevMonth: true,
                isToday: false,
                isNextMonth: false
            });
        }

        // Current month days
        const today = new Date();
        for (let i = 1; i <= lastDay; i++) {
            const isToday = i === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear();
            daysArray.push({
                day: i,
                isPrevMonth: false,
                isToday: isToday,
                isNextMonth: false
            });
        }

        // Next month days
        for (let j = 1; j <= nextDays; j++) {
            daysArray.push({
                day: j,
                isPrevMonth: false,
                isToday: false,
                isNextMonth: true
            });
        }

        calendarDays = daysArray;
    }

    function prevMonth() {
        currentMonth--;
        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
        }
        date.setMonth(currentMonth);
        date.setFullYear(currentYear);
        renderCalendar();
    }

    function nextMonth() {
        currentMonth++;
        if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }
        date.setMonth(currentMonth);
        date.setFullYear(currentYear);
        renderCalendar();
    }

    onMount(() => {
        renderCalendar();
    });
</script>

<div class="app-container">
    <div class="header-nav">
        <a href="/" class="home-btn">⌂ Home</a>
    </div>

    <div class="calendar-container" transition:fade>
        <div class="calendar-header">
            <button class="nav-btn" onclick={prevMonth}>‹</button>
            <div class="month-display">
                <h2>{months[currentMonth]}</h2>
                <p>{currentYear}</p>
            </div>
            <button class="nav-btn" onclick={nextMonth}>›</button>
        </div>

        <div class="weekdays">
            {#each days as day}
                <div>{day}</div>
            {/each}
        </div>

        <div class="days">
            {#each calendarDays as d}
                <div 
                    class="day" 
                    class:prev-date={d.isPrevMonth} 
                    class:next-date={d.isNextMonth} 
                    class:today={d.isToday}
                >
                    {d.day}
                </div>
            {/each}
        </div>
    </div>
</div>

<style>
    .app-container {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        height: 100vh;
        background: #030303;
        color: #e5e5e5;
        font-family: 'Inter', sans-serif;
    }

    .header-nav {
        position: absolute;
        top: 30px;
        left: 30px;
    }

    .home-btn {
        color: #a3a3a3;
        text-decoration: none;
        font-size: 14px;
        padding: 8px 16px;
        border-radius: 8px;
        background: rgba(255,255,255,0.05);
        transition: all 0.2s;
    }

    .home-btn:hover {
        background: rgba(255,255,255,0.1);
        color: #fff;
    }

    .calendar-container {
        width: 100%;
        max-width: 600px;
        background: #141414;
        border-radius: 24px;
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
        padding: 30px;
        border: 1px solid rgba(255,255,255,0.05);
    }

    .calendar-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 30px;
    }

    .nav-btn {
        background: rgba(255,255,255,0.05);
        border: none;
        color: #fff;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        font-size: 24px;
        cursor: pointer;
        display: flex;
        justify-content: center;
        align-items: center;
        transition: all 0.2s;
    }

    .nav-btn:hover {
        background: rgba(255,255,255,0.15);
    }

    .month-display {
        text-align: center;
    }

    .month-display h2 {
        margin: 0;
        font-size: 28px;
        font-weight: 600;
        letter-spacing: -0.5px;
    }

    .month-display p {
        margin: 4px 0 0 0;
        font-size: 14px;
        color: #a3a3a3;
    }

    .weekdays {
        display: grid;
        grid-template-columns: repeat(7, 1fr);
        text-align: center;
        font-size: 13px;
        font-weight: 600;
        color: #737373;
        margin-bottom: 15px;
        text-transform: uppercase;
        letter-spacing: 1px;
    }

    .days {
        display: grid;
        grid-template-columns: repeat(7, 1fr);
        gap: 8px;
    }

    .day {
        aspect-ratio: 1;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 16px;
        font-weight: 500;
        border-radius: 12px;
        cursor: pointer;
        transition: all 0.2s;
        border: 1px solid transparent;
    }

    .day:hover:not(.prev-date):not(.next-date) {
        background: rgba(255,255,255,0.1);
    }

    .prev-date, .next-date {
        color: #404040;
    }

    .today {
        background: #fff;
        color: #000;
        font-weight: 700;
    }

    .today:hover:not(.prev-date):not(.next-date) {
        background: #e5e5e5;
    }
</style>
