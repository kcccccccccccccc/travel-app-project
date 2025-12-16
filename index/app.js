const { createApp, ref, computed } = Vue;

const formatDate = (date) => {
    const d = new Date(date);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    const year = d.getFullYear();
    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
    return [year, month, day].join('-');
}

createApp({
    setup() {
        const currentTab = ref('schedule');
        
        // --- 行程管理 (Schedule Logic) ---
        const isDateSettingOpen = ref(false);
        const tripStartDate = ref('2025-05-10');
        const tripEndDate = ref('2025-05-14');
        const selectedDayKey = ref('day1');
        const allSchedules = ref({
            'day1': [
                { id: 101, time: '09:00', location: '淺草寺', note: '雷門拍照', weather: '晴れ', weatherIcon: 'fa-solid fa-sun' },
                { id: 102, time: '11:30', location: '晴空塔', note: '敘敘苑午餐', weather: '曇り', weatherIcon: 'fa-solid fa-cloud' },
            ],
            'day2': [{ id: 201, time: '09:30', location: '迪士尼', note: '玩全日', weather: '晴れ', weatherIcon: 'fa-solid fa-sun' }],
            'day3': [], 'day4': [], 'day5': [],
        });

        const tripDays = computed(() => {
            const days = [];
            let curr = new Date(tripStartDate.value);
            const end = new Date(tripEndDate.value);
            let idx = 1;
            while (curr <= end) {
                const key = 'day' + idx;
                days.push({ key, label: 'Day ' + idx, dayOfMonth: curr.getDate(), date: formatDate(curr) });
                if (!allSchedules.value[key]) allSchedules.value[key] = [];
                curr.setDate(curr.getDate() + 1);
                idx++;
            }
            return days;
        });
        const currentDaySchedule = computed(() => allSchedules.value[selectedDayKey.value] || []);
        const selectedDayLabel = computed(() => {
            const d = tripDays.value.find(day => day.key === selectedDayKey.value);
            return d ? `${d.label} (${d.date})` : '未選日期';
        });
        const generateTripDays = () => { isDateSettingOpen.value = false; };
        const selectDay = (key) => { selectedDayKey.value = key; };
        const addScheduleItem = () => {
            const time = prompt('時間? (如 14:00)');
            const loc = prompt('地點?');
            if(time && loc) currentDaySchedule.value.push({ id: Date.now(), time, location: loc, note: '', weather: '未知', weatherIcon: 'fa-solid fa-question' });
        };
        const deleteScheduleItem = (id) => { if(confirm('刪除?')) allSchedules.value[selectedDayKey.value] = currentDaySchedule.value.filter(i => i.id !== id); };

        // --- 記帳管理 (Money Logic) ---
        const expenses = ref([
            { id: 1, item: '西瓜卡', amount: 3000, method: 'cash', date: '2025-05-10' },
        ]);
        const newExpense = ref({ item: '', amount: '', method: 'cash', date: formatDate(new Date()) });
        const totalExpense = computed(() => expenses.value.reduce((s, c) => s + c.amount, 0));
        const sortedExpenses = computed(() => [...expenses.value].sort((a, b) => new Date(b.date) - new Date(a.date)));
        const addExpense = () => {
            if(!newExpense.value.item || !newExpense.value.amount) return;
            expenses.value.unshift({ ...newExpense.value, id: Date.now() });
            newExpense.value.item = ''; newExpense.value.amount = '';
        };
        const deleteExpense = (id) => { expenses.value = expenses.value.filter(e => e.id !== id); };

        // --- 購物清單 (Shopping Logic) ---
        const shoppingList = ref([{ name: '藥妝', checked: false }]);
        const newItem = ref('');
        const addItem = () => { if(newItem.value) { shoppingList.value.push({ name: newItem.value, checked: false }); newItem.value = ''; } };
        const removeItem = (i) => shoppingList.value.splice(i, 1);

        // --- 地圖跳轉功能 (Map Logic) ---
        const goToGoogleMaps = () => {
            window.open("https://www.google.com/maps", "_blank");
        };
        const openMap = (location) => {
            window.open(`https://www.google.com/maps/search/${encodeURIComponent(location)}`, '_blank');
        };

        return {
            currentTab, isDateSettingOpen, tripStartDate, tripEndDate, tripDays, selectedDayKey,
            currentDaySchedule, selectedDayLabel, generateTripDays, selectDay, addScheduleItem, deleteScheduleItem,
            expenses, newExpense, totalExpense, sortedExpenses, addExpense, deleteExpense,
            shoppingList, newItem, addItem, removeItem, goToGoogleMaps, openMap
        };
    }
}).mount('#app');