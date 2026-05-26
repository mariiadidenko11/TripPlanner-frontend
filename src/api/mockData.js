
export const INITIAL_DATA = {

    
    user: {
        id: 'u1',
        data_id: 'd1',
        firstname: 'Андрій',
        lastname: 'Шевченко',
        description: 'Завзятий мандрівник, люблю гори, море і нові культури. 9 поїздок за 2 роки.',
        created_at: '2024-01-01T00:00:00Z'
    },

    data_lock: [
        { id: 'd1', email: 'example11@gmail.com', hash: '123456', created_at: '2024-01-01T00:00:00Z' }
    ],

    trips: [
        {
            id: 't1', users_id: 'u1',
            name: 'Втеча на Санторіні',
            start_at: '2025-07-01T00:00:00Z', end_at: '2025-07-10T00:00:00Z',
            status: 'active', rate: 5, start_money: 8500, fact_money: 6340,
            cover: 'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?q=80&w=1223&auto=format&fit=crop',
            created_at: '2025-01-10T00:00:00Z'
        },
        {
            id: 't2', users_id: 'u1',
            name: 'Зимовий Львів',
            start_at: '2025-12-15T00:00:00Z', end_at: '2025-12-22T00:00:00Z',
            status: 'waiting', rate: 0, start_money: 800, fact_money: 120,
            cover: 'https://i.pinimg.com/originals/86/21/df/8621df95ac88f5c19135f825c94f8e7d.jpg',
            created_at: '2025-10-01T00:00:00Z'
        },
        {
            id: 't3', users_id: 'u1',
            name: 'Романтичний Париж',
            start_at: '2025-05-10T00:00:00Z', end_at: '2025-05-15T00:00:00Z',
            status: 'completed', rate: 5, start_money: 3500, fact_money: 3180,
            cover: 'https://images.unsplash.com/photo-1431274172761-fca41d930114?q=80&w=1223&auto=format&fit=crop',
            created_at: '2025-02-15T00:00:00Z'
        },
        {
            id: 't4', users_id: 'u1',
            name: 'Вічне місто Рим',
            start_at: '2026-02-10T00:00:00Z', end_at: '2026-02-17T00:00:00Z',
            status: 'completed', rate: 4, start_money: 2500, fact_money: 2650,
            cover: 'https://th.bing.com/th/id/R.eac364dfbb58e3acbc14c0be18794b94?rik=4%2bKN4ldvtPAePg&pid=ImgRaw&r=0',
            created_at: '2025-11-01T00:00:00Z'
        },
        {
            id: 't5', users_id: 'u1',
            name: 'Технологічне Токіо',
            start_at: '2025-10-10T00:00:00Z', end_at: '2025-10-24T00:00:00Z',
            status: 'active', rate: 4, start_money: 6000, fact_money: 4800,
            cover: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=1223&auto=format&fit=crop',
            created_at: '2025-06-01T00:00:00Z'
        },
        {
            id: 't6', users_id: 'u1',
            name: 'Природа Ісландії',
            start_at: '2026-04-01T00:00:00Z', end_at: '2026-04-12T00:00:00Z',
            status: 'waiting', rate: 0, start_money: 4000, fact_money: 850,
            cover: 'https://images.unsplash.com/photo-1531168556467-80aace0d0144?q=80&w=1223&auto=format&fit=crop',
            created_at: '2025-12-01T00:00:00Z'
        },
        {
            id: 't7', users_id: 'u1',
            name: 'Вогні Нью-Йорка',
            start_at: '2024-09-01T00:00:00Z', end_at: '2024-09-08T00:00:00Z',
            status: 'completed', rate: 5, start_money: 5500, fact_money: 5200,
            cover: 'https://images.unsplash.com/photo-1534430480872-3498386e7856?q=80&w=1223&auto=format&fit=crop',
            created_at: '2024-05-01T00:00:00Z'
        },
        {
            id: 't8', users_id: 'u1',
            name: 'Золота Прага',
            start_at: '2025-03-20T00:00:00Z', end_at: '2025-03-26T00:00:00Z',
            status: 'completed', rate: 4, start_money: 1800, fact_money: 1650,
            cover: 'https://images.unsplash.com/photo-1541849546-216549ae216d?q=80&w=1223&auto=format&fit=crop',
            created_at: '2025-01-05T00:00:00Z'
        },
        {
            id: 't10', users_id: 'u1',
            name: 'Літній Амстердам',
            start_at: '2025-06-10T00:00:00Z', end_at: '2025-06-17T00:00:00Z',
            status: 'completed', rate: 5, start_money: 2200, fact_money: 1980,
            cover: 'https://images.unsplash.com/photo-1576924542622-772281b13aa4?q=80&w=1223&auto=format&fit=crop',
            created_at: '2025-03-01T00:00:00Z'
        },
        {
            id: 't11', users_id: 'u1',
            name: 'Осінній Сеул',
            start_at: '2025-11-01T00:00:00Z', end_at: '2025-11-12T00:00:00Z',
            status: 'completed', rate: 5, start_money: 3800, fact_money: 3540,
            cover: 'https://images.unsplash.com/photo-1517154421773-0529f29ea451?q=80&w=1223&auto=format&fit=crop',
            created_at: '2025-07-01T00:00:00Z'
        },
        {
            id: 't12', users_id: 'u1',
            name: 'Зимова Прага',
            start_at: '2025-12-20T00:00:00Z', end_at: '2025-12-27T00:00:00Z',
            status: 'waiting', rate: 0, start_money: 1600, fact_money: 320,
            cover: 'https://www.tripsavvy.com/thmb/6_NWQcl1ZKUdVsOuctoOeub7W7A=/960x0/filters:no_upscale():max_bytes(150000):strip_icc()/GettyImages-160137787-5942abf15f9b58d58a5b4f41.jpg',
        },
        {
            id: 't9', users_id: 'u1',
            name: 'Барселона та море',
            start_at: '2025-08-05T00:00:00Z', end_at: '2025-08-14T00:00:00Z',
            status: 'active', rate: 5, start_money: 3200, fact_money: 2100,
            cover: 'https://www.espabg.com/wp-content/uploads/2019/09/barcelona-.jpg',
            created_at: '2025-04-10T00:00:00Z'
        }
    ],

    // ── public.cities ────────────────────────────────────────────────────────
    cities: [
        { id: 'c1', trips_id: 't1', name: 'Санторіні, Греція', created_at: '2025-01-10T00:00:00Z' },
        { id: 'c2', trips_id: 't2', name: 'Львів, Україна', created_at: '2025-10-01T00:00:00Z' },
        { id: 'c3', trips_id: 't3', name: 'Париж, Франція', created_at: '2025-02-15T00:00:00Z' },
        { id: 'c4', trips_id: 't4', name: 'Рим, Італія', created_at: '2025-11-01T00:00:00Z' },
        { id: 'c5', trips_id: 't5', name: 'Токіо, Японія', created_at: '2025-06-01T00:00:00Z' },
        { id: 'c6', trips_id: 't6', name: "Рейк'явік, Ісландія", created_at: '2025-12-01T00:00:00Z' },
        { id: 'c7', trips_id: 't7', name: 'Нью-Йорк, США', created_at: '2024-05-01T00:00:00Z' },
        { id: 'c8', trips_id: 't8', name: 'Прага, Чехія', created_at: '2025-01-05T00:00:00Z' },
        { id: 'c9', trips_id: 't9', name: 'Барселона, Іспанія', created_at: '2025-04-10T00:00:00Z' },
        { id: 'c10', trips_id: 't10', name: 'Амстердам, Нідерланди', created_at: '2025-03-01T00:00:00Z' },
        { id: 'c11', trips_id: 't11', name: 'Сеул, Південна Корея', created_at: '2025-07-01T00:00:00Z' },
        { id: 'c12', trips_id: 't12', name: 'Прага, Чехія', created_at: '2025-10-15T00:00:00Z' },
    ],

    // ── public.tasks ─────────────────────────────────────────────────────────
    tasks: {
        't1': [
            { id: 'tk1_1', trips_id: 't1', value: 'Забронювати готель з видом на кальдеру', check: true, note: 'Canaves Oia — 320€/ніч, сніданок включено.', created_at: '2025-06-01T00:00:00Z' },
            { id: 'tk1_2', trips_id: 't1', value: 'Купити авіаквитки Варшава → Санторіні', check: true, note: 'Ryanair FR4421 — 01.07 о 06:15.', created_at: '2025-06-02T00:00:00Z' },
            { id: 'tk1_3', trips_id: 't1', value: 'Орендувати квадроцикл на 3 дні', check: false, note: 'Moto rental у порту Фіра — 35€/день.', created_at: '2025-06-03T00:00:00Z' }
        ],
        't2': [
            { id: 'tk2_1', trips_id: 't2', value: 'Забронювати хостел у центрі', check: true, note: 'Вул. Городоцька, рейтинг 9.2 на Booking.', created_at: '2025-10-02T00:00:00Z' },
            { id: 'tk2_2', trips_id: 't2', value: 'Купити квитки на автобус Київ–Львів', check: true, note: 'FlixBus — 15.12 о 07:00, 7 годин.', created_at: '2025-10-03T00:00:00Z' },
            { id: 'tk2_3', trips_id: 't2', value: "Скласти список кав'ярень для відвідування", check: false, note: 'Fiakr, Lviv Handmade Chocolate, Pravda.', created_at: '2025-10-04T00:00:00Z' },
            { id: 'tk2_4', trips_id: 't2', value: 'Записатися на майстер-клас шоколаду', check: false, note: 'Музей шоколаду на пл. Ринок.', created_at: '2025-10-05T00:00:00Z' },
            { id: 'tk2_5', trips_id: 't2', value: 'Знайти ресторан зі спеціалітетами міста', check: false, note: 'Ресторан "Криївка" або "Dim Legend".', created_at: '2025-10-06T00:00:00Z' }
        ],
        't3': [
            { id: 'tk3_1', trips_id: 't3', value: 'Відвідати Ейфелеву вежу', check: true, note: 'Квитки на 19:00, вечірнє підсвічування.', created_at: '2025-04-01T00:00:00Z' },
            { id: 'tk3_2', trips_id: 't3', value: 'Пройтися по Лувру', check: true, note: 'Забронювати за 2 тижні, прийти о 9:00.', created_at: '2025-04-02T00:00:00Z' },
            { id: 'tk3_3', trips_id: 't3', value: 'Скуштувати круасани в Boulangerie', check: true, note: 'Поруч з Notre-Dame, відкрито з 7:00.', created_at: '2025-04-03T00:00:00Z' },
            { id: 'tk3_4', trips_id: 't3', value: 'Прогулянка по набережній Сени', check: true, note: 'Круїз на заході сонця — 15€/особу.', created_at: '2025-04-04T00:00:00Z' },
            { id: 'tk3_5', trips_id: 't3', value: 'Відвідати Монмартр і Sacré-Cœur', check: true, note: 'Приїхати о 7 ранку — без натовпу.', created_at: '2025-04-05T00:00:00Z' }
        ],
        't4': [
            { id: 'tk4_1', trips_id: 't4', value: 'Кинути монетку у Фонтан Треві', check: true, note: 'Найкраще вночі — без юрб.', created_at: '2025-11-02T00:00:00Z' },
            { id: 'tk4_2', trips_id: 't4', value: 'Екскурсія в Колізей', check: true, note: 'Квиток на сайті Coopculture — без черги.', created_at: '2025-11-03T00:00:00Z' },
            { id: 'tk4_3', trips_id: 't4', value: 'Скуштувати піцу та джелато', check: true, note: 'Pizzarium Bonci і Fatamorgana gelateria.', created_at: '2025-11-04T00:00:00Z' },
            { id: 'tk4_4', trips_id: 't4', value: 'Відвідати Музеї Ватикану', check: false, note: 'Бронювати за 2 тижні, Сикстинська каплиця.', created_at: '2025-11-05T00:00:00Z' },
            { id: 'tk4_5', trips_id: 't4', value: 'Прогулянка по Трастевере вночі', check: true, note: 'Найкращі остерії та атмосфера кварталу.', created_at: '2025-11-06T00:00:00Z' }
        ],
        't5': [
            { id: 'tk5_1', trips_id: 't5', value: 'Перейти перехрестя Сібуя', check: true, note: 'О 18:00 — найбільший натовп у світі.', created_at: '2025-09-01T00:00:00Z' },
            { id: 'tk5_2', trips_id: 't5', value: 'Відвідати храм Сенсо-джі', check: true, note: 'Рано вранці о 6:00 — без туристів.', created_at: '2025-09-02T00:00:00Z' },
            { id: 'tk5_3', trips_id: 't5', value: 'Піднятися на гору Фудзі', check: false, note: 'Сезон: липень–вересень, 5-та станція.', created_at: '2025-09-03T00:00:00Z' },
            { id: 'tk5_4', trips_id: 't5', value: 'Скуштувати рамен в Ichiran', check: true, note: 'Соло-кабінки, Сіндзюку — черга до 30 хв.', created_at: '2025-09-04T00:00:00Z' },
            { id: 'tk5_5', trips_id: 't5', value: 'Побачити Акіхабару ввечері', check: true, note: 'Неон та аніме після 20:00.', created_at: '2025-09-05T00:00:00Z' },
            { id: 'tk5_6', trips_id: 't5', value: 'Купити JR Pass до відʼїзду', check: true, note: 'Тільки за кордоном — 50 000 JPY на 14 днів.', created_at: '2025-09-06T00:00:00Z' }
        ],
        't6': [
            { id: 'tk6_1', trips_id: 't6', value: 'Забронювати Blue Lagoon заздалегідь', check: true, note: 'Квитки розкуповуються за 3 тижні.', created_at: '2025-12-02T00:00:00Z' },
            { id: 'tk6_2', trips_id: 't6', value: 'Побачити Північне Сяйво', check: false, note: 'Виїзд за місто, без освітлення, хмарність < 30%.', created_at: '2025-12-03T00:00:00Z' },
            { id: 'tk6_3', trips_id: 't6', value: 'Поїздка по Golden Circle', check: false, note: 'Гейзер Strokkur + Гюдльфосс + Тінгвеллір.', created_at: '2025-12-04T00:00:00Z' },
            { id: 'tk6_4', trips_id: 't6', value: 'Орендувати позашляховик 4×4', check: true, note: 'Dacia Duster — 80€/день, Keflavik Airport.', created_at: '2025-12-05T00:00:00Z' },
            { id: 'tk6_5', trips_id: 't6', value: "Відвідати чорний пляж Рейнісфʼяра", check: false, note: 'Обережно: хвилі небезпечні, не підходити!', created_at: '2025-12-06T00:00:00Z' }
        ],
        't7': [
            { id: 'tk7_1', trips_id: 't7', value: 'Прогулянка в Центральному парку', check: true, note: 'Взяти велосипед — $15/год.', created_at: '2024-08-01T00:00:00Z' },
            { id: 'tk7_2', trips_id: 't7', value: 'Побачити Бродвейське шоу', check: true, note: 'Hamilton — TKTS Booth 50% знижки.', created_at: '2024-08-02T00:00:00Z' },
            { id: 'tk7_3', trips_id: 't7', value: 'Піднятися на Empire State Building', check: true, note: 'Захід сонця о 20:30 з оглядового даху.', created_at: '2024-08-03T00:00:00Z' },
            { id: 'tk7_4', trips_id: 't7', value: 'Відвідати Brooklyn Bridge', check: true, note: 'Пішки з Manhattan, 20 хв прогулянки.', created_at: '2024-08-04T00:00:00Z' },
            { id: 'tk7_5', trips_id: 't7', value: 'Поїсти в Katz Delicatessen', check: true, note: 'Легендарний сендвіч з яловичиною — $25.', created_at: '2024-08-05T00:00:00Z' }
        ],
        't8': [
            { id: 'tk8_1', trips_id: 't8', value: 'Відвідати Празький Град', check: true, note: 'Найбільший замковий комплекс у світі.', created_at: '2025-01-06T00:00:00Z' },
            { id: 'tk8_2', trips_id: 't8', value: 'Пройтися по Карловому мосту', check: true, note: 'Вранці о 7:00 — без туристів і з туманом.', created_at: '2025-01-07T00:00:00Z' },
            { id: 'tk8_3', trips_id: 't8', value: 'Спробувати Trdelník з морозивом', check: true, note: 'Оригінальний — у кафе Trdelník Praha.', created_at: '2025-01-08T00:00:00Z' },
            { id: 'tk8_4', trips_id: 't8', value: 'Відвідати єврейський квартал Йозефов', check: true, note: 'Синагоги + старе кладовище, квиток 350 CZK.', created_at: '2025-01-09T00:00:00Z' },
            { id: 'tk8_5', trips_id: 't8', value: 'Скуштувати чеське пиво в U Fleků', check: false, note: 'Броварня з 1499 року, тільки темне пиво.', created_at: '2025-01-10T00:00:00Z' }
        ],
        't10': [
            { id: 'tk10_1', trips_id: 't10', value: 'Орендувати велосипед на 3 дні', check: true, note: 'MacBike rent — 15€/день, найкращий сервіс.', created_at: '2025-06-01T00:00:00Z' },
            { id: 'tk10_2', trips_id: 't10', value: 'Відвідати музей Ван Гога', check: true, note: 'Квиток онлайн за тиждень — 19€, 2 год.', created_at: '2025-06-02T00:00:00Z' },
            { id: 'tk10_3', trips_id: 't10', value: 'Прогулянка по каналах на човні', check: true, note: 'Canal Boat Tours — 1.5 год, 16€.', created_at: '2025-06-03T00:00:00Z' },
            { id: 'tk10_4', trips_id: 't10', value: 'Купити сир на ринку Albert Cuyp', check: true, note: 'Найбільший ринок Амстердаму, щодня крім неділі.', created_at: '2025-06-04T00:00:00Z' },
            { id: 'tk10_5', trips_id: 't10', value: 'Відвідати квартал де Йордан', check: false, note: 'Найатмосферніший район — кафе та галереї.', created_at: '2025-06-05T00:00:00Z' }
        ],
        't11': [
            { id: 'tk11_1', trips_id: 't11', value: 'Відвідати палац Кьонбоккун', check: true, note: 'Зміна варти о 10:00 та 14:00 — обов\'язково!', created_at: '2025-07-02T00:00:00Z' },
            { id: 'tk11_2', trips_id: 't11', value: 'Прогулянка по Інсадону', check: true, note: 'Традиційні ремесла та вулична їжа.', created_at: '2025-07-03T00:00:00Z' },
            { id: 'tk11_3', trips_id: 't11', value: 'Скуштувати bibimbap у місцевому кафе', check: true, note: 'Ресторан Gogung — автентична корейська кухня.', created_at: '2025-07-04T00:00:00Z' },
            { id: 'tk11_4', trips_id: 't11', value: 'Нічний ринок Dongdaemun', check: true, note: 'Відкритий до 5:00 ранку! Мода та стріт-фуд.', created_at: '2025-07-05T00:00:00Z' },
            { id: 'tk11_5', trips_id: 't11', value: 'Підняться на N Seoul Tower', check: false, note: 'Найкращий вид на місто. Замки кохання на вежі.', created_at: '2025-07-06T00:00:00Z' },
            { id: 'tk11_6', trips_id: 't11', value: 'Відвідати квартал Хондон', check: true, note: 'Арт-район, вуличне мистецтво, кофе-шопи.', created_at: '2025-07-07T00:00:00Z' }
        ],
        't12': [
            { id: 'tk12_1', trips_id: 't12', value: 'Відвідати Різдвяний ярмарок', check: false, note: 'Найкращий на Старомістській площі — до 6.01.', created_at: '2025-10-16T00:00:00Z' },
            { id: 'tk12_2', trips_id: 't12', value: 'Підняться на Петршинську вежу', check: false, note: 'Мініатюра Ейфелевої — вид на засніжену Прагу.', created_at: '2025-10-17T00:00:00Z' },
            { id: 'tk12_3', trips_id: 't12', value: 'Купити ялинкові іграшки на ярмарку', check: false, note: 'Богемське скло — найкращий сувенір.', created_at: '2025-10-18T00:00:00Z' },
            { id: 'tk12_4', trips_id: 't12', value: 'Пити гарячий медовик (medovina)', check: false, note: 'Мед\'яне вино — традиційний зимовий напій.', created_at: '2025-10-19T00:00:00Z' },
            { id: 'tk12_5', trips_id: 't12', value: 'Зробити фото Карлового мосту в снігу', check: false, note: 'Найкраще вранці о 7:00 — туман і сніг.', created_at: '2025-10-20T00:00:00Z' }
        ],
        't9': [
            { id: 'tk9_1', trips_id: 't9', value: 'Відвідати Саграда Фамілія', check: true, note: 'Квитки онлайн за тиждень — уникнути черги.', created_at: '2025-07-01T00:00:00Z' },
            { id: 'tk9_2', trips_id: 't9', value: 'Прогулянка по Лас-Рамблас', check: true, note: 'Ринок Бокерія — найкраще зранку.', created_at: '2025-07-02T00:00:00Z' },
            { id: 'tk9_3', trips_id: 't9', value: 'Відвідати пляж Барселонета', check: true, note: 'Прийти о 8:00 — ще вільні місця.', created_at: '2025-07-03T00:00:00Z' },
            { id: 'tk9_4', trips_id: 't9', value: 'Побачити Парк Гуель Гауді', check: false, note: 'Квитки фіксовані на час — 10€.', created_at: '2025-07-04T00:00:00Z' },
            { id: 'tk9_5', trips_id: 't9', value: 'Скуштувати справжню паелью', check: true, note: "Ресторан La Mar Salada поруч з портом.", created_at: '2025-07-05T00:00:00Z' }
        ]
    },

    // ── public.places ────────────────────────────────────────────────────────
    places: {
        't1': [
            { id: 'p1_1', trips_id: 't1', name: 'Oia — село заходу сонця', check: true, is_favourite: true, created_at: '2025-01-10T00:00:00Z' },
            { id: 'p1_2', trips_id: 't1', name: 'Червоний пляж (Kokkini Paralia)', check: true, is_favourite: true, created_at: '2025-01-10T00:00:00Z' },
            { id: 'p1_3', trips_id: 't1', name: 'Кальдера — оглядовий майданчик Фіри', check: true, is_favourite: false, created_at: '2025-01-10T00:00:00Z' },
            { id: 'p1_4', trips_id: 't1', name: 'Чорний пляж Перісса', check: true, is_favourite: false, created_at: '2025-01-10T00:00:00Z' },
            { id: 'p1_5', trips_id: 't1', name: 'Стародавнє місто Акротірі', check: false, is_favourite: false, created_at: '2025-01-10T00:00:00Z' },
            { id: 'p1_6', trips_id: 't1', name: 'Піргос — середньовічне село', check: false, is_favourite: false, created_at: '2025-01-10T00:00:00Z' }
        ],
        't2': [
            { id: 'p2_1', trips_id: 't2', name: 'Площа Ринок', check: false, is_favourite: true, created_at: '2025-10-01T00:00:00Z' },
            { id: 'p2_2', trips_id: 't2', name: 'Личаківський цвинтар', check: false, is_favourite: false, created_at: '2025-10-01T00:00:00Z' },
            { id: 'p2_3', trips_id: 't2', name: 'Замок Олеська', check: false, is_favourite: false, created_at: '2025-10-01T00:00:00Z' },
            { id: 'p2_4', trips_id: 't2', name: 'Вулиця Валова — кавярні', check: false, is_favourite: true, created_at: '2025-10-01T00:00:00Z' },
            { id: 'p2_5', trips_id: 't2', name: 'Музей шоколаду Lviv Handmade', check: false, is_favourite: false, created_at: '2025-10-01T00:00:00Z' }
        ],
        't3': [
            { id: 'p3_1', trips_id: 't3', name: 'Ейфелева вежа', check: true, is_favourite: true, created_at: '2025-02-15T00:00:00Z' },
            { id: 'p3_2', trips_id: 't3', name: 'Лувр', check: true, is_favourite: false, created_at: '2025-02-15T00:00:00Z' },
            { id: 'p3_3', trips_id: 't3', name: 'Базиліка Сакре-Кер', check: true, is_favourite: true, created_at: '2025-02-15T00:00:00Z' },
            { id: 'p3_4', trips_id: 't3', name: 'Набережна Сени', check: true, is_favourite: false, created_at: '2025-02-15T00:00:00Z' },
            { id: 'p3_5', trips_id: 't3', name: 'Версальський палац', check: false, is_favourite: false, created_at: '2025-02-15T00:00:00Z' }
        ],
        't4': [
            { id: 'p4_1', trips_id: 't4', name: 'Колізей', check: true, is_favourite: true, created_at: '2025-11-01T00:00:00Z' },
            { id: 'p4_2', trips_id: 't4', name: 'Фонтан Треві', check: true, is_favourite: true, created_at: '2025-11-01T00:00:00Z' },
            { id: 'p4_3', trips_id: 't4', name: 'Пантеон', check: true, is_favourite: false, created_at: '2025-11-01T00:00:00Z' },
            { id: 'p4_4', trips_id: 't4', name: 'Собор Святого Петра', check: false, is_favourite: false, created_at: '2025-11-01T00:00:00Z' },
            { id: 'p4_5', trips_id: 't4', name: 'Квартал Трастевере', check: true, is_favourite: true, created_at: '2025-11-01T00:00:00Z' }
        ],
        't5': [
            { id: 'p5_1', trips_id: 't5', name: 'Перехрестя Сібуя', check: true, is_favourite: true, created_at: '2025-06-01T00:00:00Z' },
            { id: 'p5_2', trips_id: 't5', name: 'Храм Сенсо-джі', check: true, is_favourite: false, created_at: '2025-06-01T00:00:00Z' },
            { id: 'p5_3', trips_id: 't5', name: 'Святилище Мейдзі', check: true, is_favourite: false, created_at: '2025-06-01T00:00:00Z' },
            { id: 'p5_4', trips_id: 't5', name: 'Гора Фудзі', check: false, is_favourite: true, created_at: '2025-06-01T00:00:00Z' },
            { id: 'p5_5', trips_id: 't5', name: 'Акіхабара', check: true, is_favourite: false, created_at: '2025-06-01T00:00:00Z' },
            { id: 'p5_6', trips_id: 't5', name: 'Токійська телевежа', check: false, is_favourite: false, created_at: '2025-06-01T00:00:00Z' }
        ],
        't6': [
            { id: 'p6_1', trips_id: 't6', name: 'Блакитна Лагуна', check: false, is_favourite: true, created_at: '2025-12-01T00:00:00Z' },
            { id: 'p6_2', trips_id: 't6', name: 'Водоспад Гюдльфосс', check: false, is_favourite: false, created_at: '2025-12-01T00:00:00Z' },
            { id: 'p6_3', trips_id: 't6', name: 'Гейзер Strokkur', check: false, is_favourite: false, created_at: '2025-12-01T00:00:00Z' },
            { id: 'p6_4', trips_id: 't6', name: "Чорний пляж Рейнісфʼяра", check: false, is_favourite: true, created_at: '2025-12-01T00:00:00Z' },
            { id: 'p6_5', trips_id: 't6', name: 'Національний парк Тінгвеллір', check: false, is_favourite: false, created_at: '2025-12-01T00:00:00Z' }
        ],
        't7': [
            { id: 'p7_1', trips_id: 't7', name: 'Центральний парк', check: true, is_favourite: true, created_at: '2024-05-01T00:00:00Z' },
            { id: 'p7_2', trips_id: 't7', name: 'Таймс-Сквер', check: true, is_favourite: false, created_at: '2024-05-01T00:00:00Z' },
            { id: 'p7_3', trips_id: 't7', name: 'Емпайр-Стейт-Білдінг', check: true, is_favourite: true, created_at: '2024-05-01T00:00:00Z' },
            { id: 'p7_4', trips_id: 't7', name: 'Brooklyn Bridge', check: true, is_favourite: false, created_at: '2024-05-01T00:00:00Z' },
            { id: 'p7_5', trips_id: 't7', name: 'Статуя Свободи', check: false, is_favourite: true, created_at: '2024-05-01T00:00:00Z' }
        ],
        't8': [
            { id: 'p8_1', trips_id: 't8', name: 'Празький Град', check: true, is_favourite: true, created_at: '2025-01-05T00:00:00Z' },
            { id: 'p8_2', trips_id: 't8', name: 'Карлів міст', check: true, is_favourite: true, created_at: '2025-01-05T00:00:00Z' },
            { id: 'p8_3', trips_id: 't8', name: 'Єврейський квартал Йозефов', check: true, is_favourite: false, created_at: '2025-01-05T00:00:00Z' },
            { id: 'p8_4', trips_id: 't8', name: 'Старомістська площа з годинником', check: true, is_favourite: true, created_at: '2025-01-05T00:00:00Z' },
            { id: 'p8_5', trips_id: 't8', name: 'Вишеград — фортеця над Влтавою', check: false, is_favourite: false, created_at: '2025-01-05T00:00:00Z' }
        ],
        't10': [
            { id: 'pp10_1', trips_id: 't10', name: 'Музей Ван Гога', check: true, is_favourite: true, created_at: '2025-03-01T00:00:00Z' },
            { id: 'pp10_2', trips_id: 't10', name: 'Канали Йорданського кварталу', check: true, is_favourite: true, created_at: '2025-03-01T00:00:00Z' },
            { id: 'pp10_3', trips_id: 't10', name: 'Площа Дам — серце міста', check: true, is_favourite: false, created_at: '2025-03-01T00:00:00Z' },
            { id: 'pp10_4', trips_id: 't10', name: 'Ринок Albert Cuyp', check: true, is_favourite: false, created_at: '2025-03-01T00:00:00Z' },
            { id: 'pp10_5', trips_id: 't10', name: 'Лісовий парк Амстердам-Бос', check: false, is_favourite: false, created_at: '2025-03-01T00:00:00Z' },
            { id: 'pp10_6', trips_id: 't10', name: 'Рейксмузей', check: false, is_favourite: false, created_at: '2025-03-01T00:00:00Z' }
        ],
        't11': [
            { id: 'pp11_1', trips_id: 't11', name: 'Палац Кьонбоккун', check: true, is_favourite: true, created_at: '2025-07-01T00:00:00Z' },
            { id: 'pp11_2', trips_id: 't11', name: 'Квартал Інсадон', check: true, is_favourite: false, created_at: '2025-07-01T00:00:00Z' },
            { id: 'pp11_3', trips_id: 't11', name: 'N Seoul Tower (Намсан)', check: false, is_favourite: true, created_at: '2025-07-01T00:00:00Z' },
            { id: 'pp11_4', trips_id: 't11', name: 'Ринок Dongdaemun DDP', check: true, is_favourite: false, created_at: '2025-07-01T00:00:00Z' },
            { id: 'pp11_5', trips_id: 't11', name: 'Квартал Хондон — арт та кафе', check: true, is_favourite: true, created_at: '2025-07-01T00:00:00Z' },
            { id: 'pp11_6', trips_id: 't11', name: 'Храм Джогеса', check: false, is_favourite: false, created_at: '2025-07-01T00:00:00Z' }
        ],
        't12': [
            { id: 'pp12_1', trips_id: 't12', name: 'Різдвяний ярмарок Старомістська пл.', check: false, is_favourite: false, created_at: '2025-10-15T00:00:00Z' },
            { id: 'pp12_2', trips_id: 't12', name: 'Карлів міст у снігу', check: false, is_favourite: true, created_at: '2025-10-15T00:00:00Z' },
            { id: 'pp12_3', trips_id: 't12', name: 'Петршинська вежа', check: false, is_favourite: false, created_at: '2025-10-15T00:00:00Z' },
            { id: 'pp12_4', trips_id: 't12', name: 'Пражський Град у зимовому тумані', check: false, is_favourite: true, created_at: '2025-10-15T00:00:00Z' }
        ],
        't9': [
            { id: 'p9_1', trips_id: 't9', name: 'Саграда Фамілія', check: true, is_favourite: true, created_at: '2025-04-10T00:00:00Z' },
            { id: 'p9_2', trips_id: 't9', name: 'Лас-Рамблас та ринок Бокерія', check: true, is_favourite: false, created_at: '2025-04-10T00:00:00Z' },
            { id: 'p9_3', trips_id: 't9', name: 'Пляж Барселонета', check: true, is_favourite: false, created_at: '2025-04-10T00:00:00Z' },
            { id: 'p9_4', trips_id: 't9', name: 'Парк Гуель', check: false, is_favourite: true, created_at: '2025-04-10T00:00:00Z' },
            { id: 'p9_5', trips_id: 't9', name: 'Квартал Готичний', check: true, is_favourite: false, created_at: '2025-04-10T00:00:00Z' },
            { id: 'p9_6', trips_id: 't9', name: 'Палац Музики Каталонії', check: false, is_favourite: false, created_at: '2025-04-10T00:00:00Z' }
        ]
    },

    // ── public.reservation ───────────────────────────────────────────────────
    bookings: {
        't1': [
            { id: 'b1_1', trips_id: 't1', type_id: 'accommodation', name: 'Canaves Oia Suites & Spa', cost: 2880, address: 'Oia 847 02, Santorini', note: '9 ночей × 320€, вид на кальдеру, сніданок.', start_at: '2025-07-01T14:00:00Z', end_at: '2025-07-10T11:00:00Z', created_at: '2025-01-10T00:00:00Z' },
            { id: 'b1_2', trips_id: 't1', type_id: 'transport', name: 'Авіаквитки Ryanair WAW→JTR та назад', cost: 418, address: 'Santorini Airport (JTR)', note: 'Туди: FR4421, 01.07 о 06:15. Назад: FR4422, 10.07.', start_at: '2025-07-01T06:15:00Z', end_at: '2025-07-10T14:20:00Z', created_at: '2025-01-10T00:00:00Z' },
            { id: 'b1_3', trips_id: 't1', type_id: 'activity', name: 'Дайвінг-тур Santorini Dive Center', cost: 290, address: 'Monolithos Beach', note: '2 занурення: кальдера + підводні печери. Фото включено.', start_at: '2025-07-05T09:00:00Z', end_at: '2025-07-05T14:00:00Z', created_at: '2025-01-10T00:00:00Z' },
            { id: 'b1_4', trips_id: 't1', type_id: 'food', name: 'Вечеря в Ammoudi Fish Tavern', cost: 180, address: 'Ammoudi Bay, Oia', note: 'Стіл на 2, 20:30, омар + Assyrtiko. Тільки готівка.', start_at: '2025-07-03T20:30:00Z', end_at: null, created_at: '2025-01-10T00:00:00Z' }
        ],
        't2': [
            { id: 'b2_1', trips_id: 't2', type_id: 'accommodation', name: 'Hostel Citylights Lviv', cost: 240, address: 'вул. Городоцька, 5, Львів', note: 'Dormitory, 7 ночей, рейтинг 9.2.', start_at: '2025-12-15T15:00:00Z', end_at: '2025-12-22T12:00:00Z', created_at: '2025-10-01T00:00:00Z' },
            { id: 'b2_2', trips_id: 't2', type_id: 'transport', name: 'Автобус Київ–Львів–Київ', cost: 80, address: 'Автостанція Київ', note: 'FlixBus туди-назад. 15.12 о 07:00, 22.12 о 18:00.', start_at: '2025-12-15T07:00:00Z', end_at: '2025-12-22T01:00:00Z', created_at: '2025-10-01T00:00:00Z' }
        ],
        't3': [
            { id: 'b3_1', trips_id: 't3', type_id: 'accommodation', name: 'Hôtel du Louvre Paris', cost: 1800, address: '1 Place André Malraux, Paris', note: 'Стандарт двомісний, вид на місто, 5 ночей.', start_at: '2025-05-10T15:00:00Z', end_at: '2025-05-15T11:00:00Z', created_at: '2025-02-15T00:00:00Z' },
            { id: 'b3_2', trips_id: 't3', type_id: 'transport', name: 'Авіаквитки Air France KBP→CDG', cost: 600, address: 'CDG Terminal 2', note: 'Прямий рейс AF1164, 10.05 о 08:00.', start_at: '2025-05-10T08:00:00Z', end_at: null, created_at: '2025-02-15T00:00:00Z' },
            { id: 'b3_3', trips_id: 't3', type_id: 'activity', name: 'Paris Museum Pass 4 дні', cost: 80, address: 'Париж', note: 'Вхід у 60+ музеїв без черги, активується при першому вході.', start_at: null, end_at: null, created_at: '2025-02-15T00:00:00Z' }
        ],
        't4': [
            { id: 'b4_1', trips_id: 't4', type_id: 'accommodation', name: 'B&B Hotel Roma Ostiense', cost: 1500, address: 'Via Benedetto Croce, Roma', note: '7 ночей, зручно до Трастевере та метро.', start_at: '2026-02-10T14:00:00Z', end_at: '2026-02-17T10:00:00Z', created_at: '2025-11-01T00:00:00Z' },
            { id: 'b4_2', trips_id: 't4', type_id: 'transport', name: 'Авіаквитки WizzAir KBP→FCO', cost: 450, address: 'Fiumicino Airport, Roma', note: 'Прямий рейс, 10.02 о 06:30, багаж 20кг включено.', start_at: '2026-02-10T06:30:00Z', end_at: null, created_at: '2025-11-01T00:00:00Z' },
            { id: 'b4_3', trips_id: 't4', type_id: 'activity', name: 'Гастро-тур Трастевере', cost: 700, address: 'Trastevere, Roma', note: 'Вино, паста, тірамісу — вечірній тур, 19:00, 4 год.', start_at: '2026-02-13T19:00:00Z', end_at: null, created_at: '2025-11-01T00:00:00Z' }
        ],
        't5': [
            { id: 'b5_1', trips_id: 't5', type_id: 'transport', name: 'Авіаквитки LOT KBP→HND', cost: 1500, address: 'Haneda Airport, Tokyo', note: 'Пересадка Варшава, 10.10 о 10:00, прибуття 11.10.', start_at: '2025-10-10T10:00:00Z', end_at: null, created_at: '2025-06-01T00:00:00Z' },
            { id: 'b5_2', trips_id: 't5', type_id: 'accommodation', name: 'Shinjuku Granbell Hotel', cost: 2300, address: 'Shinjuku, Tokyo', note: '14 ночей, смарт-готель, поруч з JR Shinjuku Station.', start_at: '2025-10-10T15:00:00Z', end_at: '2025-10-24T11:00:00Z', created_at: '2025-06-01T00:00:00Z' },
            { id: 'b5_3', trips_id: 't5', type_id: 'transport', name: 'JR Pass 14 днів', cost: 1000, address: 'Японія (всі залізниці)', note: 'Шінкансен + локальні потяги. Купити до відʼїзду.', start_at: null, end_at: null, created_at: '2025-06-01T00:00:00Z' }
        ],
        't6': [
            { id: 'b6_1', trips_id: 't6', type_id: 'transport', name: "Авіаквитки FlyPlay KBP→KEF", cost: 700, address: 'Keflavik Airport (KEF)', note: '1 пересадка у Ризі, 01.04 о 07:00.', start_at: '2026-04-01T07:00:00Z', end_at: null, created_at: '2025-12-01T00:00:00Z' },
            { id: 'b6_2', trips_id: 't6', type_id: 'transport', name: 'Оренда Dacia Duster 4×4', cost: 880, address: "Reykjavík Car Rental", note: '11 днів × 80€, необхідний для F-roads та Highlands.', start_at: '2026-04-01T12:00:00Z', end_at: '2026-04-12T10:00:00Z', created_at: '2025-12-01T00:00:00Z' },
            { id: 'b6_3', trips_id: 't6', type_id: 'accommodation', name: "Guesthouse Reykjavík Center", cost: 990, address: "Reykjavík Center", note: '11 ночей, сніданок, вид на бухту Факсафлой.', start_at: '2026-04-01T15:00:00Z', end_at: '2026-04-12T11:00:00Z', created_at: '2025-12-01T00:00:00Z' }
        ],
        't7': [
            { id: 'b7_1', trips_id: 't7', type_id: 'accommodation', name: 'Row NYC Hotel Times Square', cost: 1800, address: '700 8th Ave, New York', note: '7 ночей, крок від Times Square, вид на місто.', start_at: '2024-09-01T15:00:00Z', end_at: '2024-09-08T11:00:00Z', created_at: '2024-05-01T00:00:00Z' },
            { id: 'b7_2', trips_id: 't7', type_id: 'transport', name: 'Авіаквитки LOT KBP→JFK', cost: 900, address: 'JFK Airport', note: 'Пересадка Варшава, 01.09 о 09:00.', start_at: '2024-09-01T09:00:00Z', end_at: null, created_at: '2024-05-01T00:00:00Z' },
            { id: 'b7_3', trips_id: 't7', type_id: 'activity', name: 'Квиток на Бродвей — Hamilton', cost: 180, address: 'Richard Rodgers Theatre, NYC', note: 'VIP місця E рядок, 03.09 о 19:30.', start_at: '2024-09-03T19:30:00Z', end_at: null, created_at: '2024-05-01T00:00:00Z' }
        ],
        't8': [
            { id: 'b8_1', trips_id: 't8', type_id: 'accommodation', name: 'Hotel Clementin Praha', cost: 720, address: 'Betlémské nám. 3, Praha', note: '6 ночей, 5 хв від Карлового мосту.', start_at: '2025-03-20T15:00:00Z', end_at: '2025-03-26T11:00:00Z', created_at: '2025-01-05T00:00:00Z' },
            { id: 'b8_2', trips_id: 't8', type_id: 'transport', name: 'Авіаквитки WizzAir KBP→PRG', cost: 280, address: 'Václav Havel Airport, Praha', note: 'Прямий рейс, 20.03 о 11:00. Назад 26.03 о 14:00.', start_at: '2025-03-20T11:00:00Z', end_at: '2025-03-26T15:30:00Z', created_at: '2025-01-05T00:00:00Z' }
        ],
        't10': [
            { id: 'bb10_1', trips_id: 't10', type_id: 'accommodation', name: 'Hotel V Nesplein Amsterdam', cost: 980, address: 'Nesplein 49, Amsterdam', note: '7 ночей, дизайн-готель у центрі, сніданок.', start_at: '2025-06-10T15:00:00Z', end_at: '2025-06-17T11:00:00Z', created_at: '2025-03-01T00:00:00Z' },
            { id: 'bb10_2', trips_id: 't10', type_id: 'transport', name: 'Авіаквитки KLM KBP→AMS', cost: 420, address: 'Amsterdam Schiphol Airport', note: 'Прямий рейс, 10.06 о 09:00, 3 год.', start_at: '2025-06-10T09:00:00Z', end_at: null, created_at: '2025-03-01T00:00:00Z' },
            { id: 'bb10_3', trips_id: 't10', type_id: 'activity', name: 'Canal Boat Tour + Van Gogh Museum', cost: 55, address: 'Amsterdam Center', note: 'Комбо-квиток з 20% знижкою.', start_at: '2025-06-12T11:00:00Z', end_at: null, created_at: '2025-03-01T00:00:00Z' }
        ],
        't11': [
            { id: 'bb11_1', trips_id: 't11', type_id: 'accommodation', name: 'Lotte City Hotel Myeongdong', cost: 1540, address: 'Myeongdong, Seoul', note: '11 ночей, поруч з метро, сніданок.', start_at: '2025-11-01T15:00:00Z', end_at: '2025-11-12T11:00:00Z', created_at: '2025-07-01T00:00:00Z' },
            { id: 'bb11_2', trips_id: 't11', type_id: 'transport', name: 'Авіаквитки Asiana KBP→ICN', cost: 980, address: 'Incheon International Airport', note: 'Пересадка Відень, 01.11 о 08:00.', start_at: '2025-11-01T08:00:00Z', end_at: null, created_at: '2025-07-01T00:00:00Z' },
            { id: 'bb11_3', trips_id: 't11', type_id: 'activity', name: 'K-Food Tour Gangnam', cost: 65, address: 'Gangnam District, Seoul', note: 'Дегустація 8 страв корейської кухні, 4 год.', start_at: '2025-11-05T18:00:00Z', end_at: null, created_at: '2025-07-01T00:00:00Z' }
        ],
        't12': [
            { id: 'bb12_1', trips_id: 't12', type_id: 'accommodation', name: 'Hotel Josef Prague', cost: 840, address: 'Rybná 20, Praha 1', note: '7 ночей, дизайн-бутик, 5 хв від Старого міста.', start_at: '2025-12-20T15:00:00Z', end_at: '2025-12-27T11:00:00Z', created_at: '2025-10-15T00:00:00Z' },
            { id: 'bb12_2', trips_id: 't12', type_id: 'transport', name: 'Авіаквитки WizzAir KBP→PRG', cost: 260, address: 'Václav Havel Airport Prague', note: 'Прямий рейс, 20.12 о 14:00. Назад 27.12 о 16:00.', start_at: '2025-12-20T14:00:00Z', end_at: '2025-12-27T18:00:00Z', created_at: '2025-10-15T00:00:00Z' }
        ],
        't9': [
            { id: 'b9_1', trips_id: 't9', type_id: 'accommodation', name: 'Hotel Arts Barcelona', cost: 1200, address: 'Carrer de la Marina, Barcelona', note: '9 ночей, поруч з пляжем Барселонета, вид на море.', start_at: '2025-08-05T15:00:00Z', end_at: '2025-08-14T11:00:00Z', created_at: '2025-04-10T00:00:00Z' },
            { id: 'b9_2', trips_id: 't9', type_id: 'transport', name: 'Авіаквитки Vueling KBP→BCN', cost: 380, address: 'Barcelona El Prat Airport', note: 'Пересадка Рим, 05.08 о 08:00.', start_at: '2025-08-05T08:00:00Z', end_at: null, created_at: '2025-04-10T00:00:00Z' },
            { id: 'b9_3', trips_id: 't9', type_id: 'activity', name: 'Квиток Саграда Фамілія + Вежі', cost: 45, address: 'Avinguda de Gaudí, Barcelona', note: 'Вхід + підйом на Вежу Народження, 06.08 о 10:00.', start_at: '2025-08-06T10:00:00Z', end_at: null, created_at: '2025-04-10T00:00:00Z' }
        ]
    },

    // ── public.trip_notes ────────────────────────────────────────────────────
    notes: {
        't1': [
            { id: 'n1_1', trips_id: 't1', value: 'Що взяти з собою\nСонцезахисний крем SPF 50+ — пекельне сонце. Сандалі з закритим носком — бруківка в Oia слизька. Готівка євро — тавернi не приймають картки. Powerbank — критично для фото на заході.', check: true, created_at: '2025-06-20T00:00:00Z' },
            { id: 'n1_2', trips_id: 't1', value: 'Захід сонця в Oia — лайфхак\nНЕ іди на Castle Ruins — 500+ людей. Замість — кафе Karma або 1800 на Nikolaou Nomikou. Прийти за 45 хв. Сонце сідає о 20:45 у липні. Після заходу Oia перетворюється на казку.', check: false, created_at: '2025-07-02T00:00:00Z' }
        ],
        't2': [
            { id: 'n2_1', trips_id: 't2', value: "Список кав'ярень Львова\nFiakr (вул. Листопадового Чину), Lviv Handmade Chocolate (пл. Ринок), Pravda Beer Theatre (пл. Ринок 32), Pid Zolotoyu Rozoyu, Kumpel — пивоварня.", check: false, created_at: '2025-11-10T00:00:00Z' },
            { id: 'n2_2', trips_id: 't2', value: "Ресторани на вечерю\nКриївка — антуражний ресторан з паролем 'Слава Україні'. Dim Legend — сучасна українська кухня. Rebernya — реберця та м'ясо на вогні.", check: false, created_at: '2025-11-11T00:00:00Z' }
        ],
        't3': [
            { id: 'n3_1', trips_id: 't3', value: 'Паризькі враження\nЛувр зайняв половину дня — прийти до відкриття. Monoprix — найкращий супермаркет для сніданків. Версаль відклали: черга на 3 год.', check: true, created_at: '2025-05-12T00:00:00Z' },
            { id: 'n3_2', trips_id: 't3', value: 'Ресторани та кафе\nLe Comptoir du Relais — бронювати за 2 тижні. Breizh Café — найкращі галети. Café de Flore — дорого, але атмосфера.', check: false, created_at: '2025-05-13T00:00:00Z' }
        ],
        't4': [
            { id: 'n4_1', trips_id: 't4', value: 'Лайфхаки Рим\nКолізей + Форум = єдиний квиток через Coopculture (без черги). Пантеон — безкоштовно, але черга. Гелато: Fatamorgana > решти.', check: false, created_at: '2026-01-10T00:00:00Z' },
            { id: 'n4_2', trips_id: 't4', value: 'Транспорт в Римі\nМетро лише 2 лінії — краще пішки або трамвай. 48-год квиток на транспорт = 7€. Таксі — завжди білі офіційні, Uber теж є.', check: false, created_at: '2026-01-11T00:00:00Z' }
        ],
        't5': [
            { id: 'n5_1', trips_id: 't5', value: 'Токіо транспорт\nIC-картка Suica = метро + автобуси + магазини. Поповнити в аеропорті Haneda. Потяги завжди вчасно — японська пунктуальність.', check: false, created_at: '2025-09-10T00:00:00Z' },
            { id: 'n5_2', trips_id: 't5', value: "Їжа в Токіо\nТсукіджі ринок — суші вранці о 5:00. Conveyor belt sushi в Kura Sushi — дешево. Якінікy (барбекю) на Шіндзюку — обов'язково спробувати.", check: true, created_at: '2025-09-11T00:00:00Z' }
        ],
        't6': [
            { id: 'n6_1', trips_id: 't6', value: "Ісландія — безпека та підготовка\nF-roads відкриваються з червня. Завжди мати термо-одяг та дощовик. Заправлятися в кожному місті. Попередження погоди: veður.is.", check: false, created_at: '2025-12-10T00:00:00Z' },
            { id: 'n6_2', trips_id: 't6', value: "Північне Сяйво — поради\nАкток: aurora.vedur.is — прогноз. Ідеальні умови: темно, хмарність < 20%, KP > 3. Виїхати з міста на 30 км. Довга витримка камери.", check: false, created_at: '2025-12-11T00:00:00Z' }
        ],
        't7': [
            { id: 'n7_1', trips_id: 't7', value: "NYC лайфхаки\nMETROCard на тиждень = $34. Бродвей: TKTS Booth на Times Square — квитки за 50% ціни. Чайнатаун — дешевий обід. Staten Island Ferry — безкоштовно + вид на статую.", check: true, created_at: '2024-08-10T00:00:00Z' },
            { id: 'n7_2', trips_id: 't7', value: "Найкращі враження від NYC\nЦентральний парк на велосипеді — топ-1. Бруклінський міст пішки — обов'язково. Вид з Empire State о закаті — незабутній. Хот-дог з Carts — автентично.", check: true, created_at: '2024-09-05T00:00:00Z' }
        ],
        't8': [
            { id: 'n8_1', trips_id: 't8', value: 'Прага — практичні поради\nОплата: чеська крона (CZK), 1 EUR ≈ 25 CZK. Карти приймають скрізь. Транспорт: 30-хв квиток 30 CZK. Від аеропорту: автобус 119 + метро — 40 хв.', check: true, created_at: '2025-01-06T00:00:00Z' },
            { id: 'n8_2', trips_id: 't8', value: "Де поїсти в Празі\nKolkovna — традиційна чеська кухня, відкрита 11-23. U Fleků — пивоварня з 1499 р. Lokál Dlouhá — крафтове Pilsner Urquell. Уникати туристичних ресторанів біля Карлового мосту!", check: false, created_at: '2025-01-07T00:00:00Z' }
        ],
        't10': [
            { id: 'nn10_1', trips_id: 't10', value: 'Амстердам на велосипеді\nМісто ІДЕАЛЬНЕ для велопрогулянок. MacBike — найкращий прокат. Завжди дивись у два боки: трамваї безшумні і небезпечні! Схема велодоріжок — окремо від авто.', check: true, created_at: new Date('2025-06-11').toISOString() },
            { id: 'nn10_2', trips_id: 't10', value: 'Де поїсти в Амстердамі\nStroopwafel з гарячого кавомата — ОБОВ\'ЯЗКОВО. Heineken Experience — екскурсія + дегустація 18€. Ринок Альберт Кейп — найкращий сир Гауда та оселедець.', check: false, created_at: new Date('2025-06-13').toISOString() }
        ],
        't11': [
            { id: 'nn11_1', trips_id: 't11', value: 'Осінній Сеул — найкращий час\nЖовтень–листопад: листя гінкго і клену. Парк Намсан — феєрія кольорів. Температура 5-15°C — ідеально для прогулянок. Обов\'язково взяти легку куртку.', check: true, created_at: new Date('2025-11-02').toISOString() },
            { id: 'nn11_2', trips_id: 't11', value: 'Корейська кухня — топ страви\n1. Bibimbap — рис з овочами та яйцем. 2. Tteokbokki — гострі рисові трубочки. 3. Samgyeopsal — барбекю зі свинини. 4. Japchae — скляна локшина. 5. Bingsu — крижаний десерт.', check: false, created_at: new Date('2025-11-04').toISOString() }
        ],
        't12': [
            { id: 'nn12_1', trips_id: 't12', value: 'Зимова Прага — підготовка\nОдяг: термо-білизна + пуховик + нековзні чоботи. Вологість висока — мерзнути більше ніж здається. Різдвяний ярмарок: 10:00-22:00. Найкраще фото: Карлів міст о 7 ранку в тумані.', check: false, created_at: new Date('2025-12-01').toISOString() },
            { id: 'nn12_2', trips_id: 't12', value: 'Різдвяні сувеніри з Праги\nБогемське скло — унікальний подарунок. Марципанові фігурки з Manufaktura. Зимовий медовик (medovina) — привезти кілька пляшок. Дерев\'яні іграшки ручної роботи — Старе Місто.', check: false, created_at: new Date('2025-12-02').toISOString() }
        ],
        't9': [
            { id: 'n9_1', trips_id: 't9', value: "Барселона — лайфхаки\nТранспорт: T-Casual 10 поїздок = 11.35€. Саграда Фамілія — тільки з квитком онлайн. Пляж Барселонета — вранці о 8 ще немає натовпу. Tapas у районі Гот — автентично.", check: false, created_at: '2025-07-01T00:00:00Z' },
            { id: 'n9_2', trips_id: 't9', value: "Гастрономія Барселони\nLa Boqueria — купляти фрукти, уникати готових страв (перепродаж). Pa amb tomàquet — хліб з томатом. Паелья тільки в ресторанах біля порту. Сangre de toro — місцеве вино.", check: false, created_at: '2025-07-02T00:00:00Z' }
        ]
    },

    // ── photos ───────────────────────────────────────────────────────────────
    photos: {
        't1': [
            { id: 'ph1_1', trips_id: 't1', url: 'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?q=80&w=1223', created_at: '2025-07-03T00:00:00Z' },
            { id: 'ph1_2', trips_id: 't1', url: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?q=80&w=1223', created_at: '2025-07-05T00:00:00Z' }
        ],
        't2': [
            { id: 'ph2_1', trips_id: 't2', url: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?q=80&w=1223', created_at: '2025-12-16T00:00:00Z' }
        ],
        't3': [
            { id: 'ph3_1', trips_id: 't3', url: 'https://images.unsplash.com/photo-1431274172761-fca41d930114?q=80&w=1223', created_at: '2025-05-11T00:00:00Z' },
            { id: 'ph3_2', trips_id: 't3', url: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?q=80&w=1223', created_at: '2025-05-12T00:00:00Z' }
        ],
        't4': [
            { id: 'ph4_1', trips_id: 't4', url: 'https://images.unsplash.com/photo-1555992336-03a23c7b20ee?q=80&w=1223', created_at: '2026-02-12T00:00:00Z' }
        ],
        't5': [
            { id: 'ph5_1', trips_id: 't5', url: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=1223', created_at: '2025-10-12T00:00:00Z' },
            { id: 'ph5_2', trips_id: 't5', url: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?q=80&w=1223', created_at: '2025-10-15T00:00:00Z' }
        ],
        't6': [
            { id: 'ph6_1', trips_id: 't6', url: 'https://images.unsplash.com/photo-1531168556467-80aace0d0144?q=80&w=1223', created_at: '2026-04-03T00:00:00Z' }
        ],
        't7': [
            { id: 'ph7_1', trips_id: 't7', url: 'https://images.unsplash.com/photo-1534430480872-3498386e7856?q=80&w=1223', created_at: '2024-09-03T00:00:00Z' },
            { id: 'ph7_2', trips_id: 't7', url: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?q=80&w=1223', created_at: '2024-09-05T00:00:00Z' }
        ],
        't8': [
            { id: 'ph8_1', trips_id: 't8', url: 'https://images.unsplash.com/photo-1541849546-216549ae216d?q=80&w=1223', created_at: '2025-03-21T00:00:00Z' }
        ],
        't10': [
            { id: 'pph10_1', trips_id: 't10', url: 'https://images.unsplash.com/photo-1576924542622-772281b13aa4?q=80&w=1223', created_at: new Date('2025-06-12').toISOString() },
            { id: 'pph10_2', trips_id: 't10', url: 'https://images.unsplash.com/photo-1534351590666-13e3e96b5017?q=80&w=1223', created_at: new Date('2025-06-14').toISOString() }
        ],
        't11': [
            { id: 'pph11_1', trips_id: 't11', url: 'https://images.unsplash.com/photo-1517154421773-0529f29ea451?q=80&w=1223', created_at: new Date('2025-11-03').toISOString() },
            { id: 'pph11_2', trips_id: 't11', url: 'https://images.unsplash.com/photo-1540573133985-87b6da6d54a9?q=80&w=1223', created_at: new Date('2025-11-06').toISOString() }
        ],
        't12': [
            { id: 'pph12_1', trips_id: 't12', url: 'https://images.unsplash.com/photo-1541849546-216549ae216d?q=80&w=1223', created_at: new Date('2025-12-21').toISOString() }
        ],
        't9': [
            { id: 'ph9_1', trips_id: 't9', url: 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?q=80&w=1223', created_at: '2025-08-06T00:00:00Z' },
            { id: 'ph9_2', trips_id: 't9', url: 'https://images.unsplash.com/photo-1504019347908-b45f9b0b8dd5?q=80&w=1223', created_at: '2025-08-08T00:00:00Z' }
        ]
    },
    // ── expenses (source of truth for fact_money) ─────────────────────────
    expenses: {
        't1': [
            { id: 'ex1_1', trips_id: 't1', cat: 'accommodation', amount: 2880, note: 'Canaves Oia Suites 9 ночей', date: '2025-07-01' },
            { id: 'ex1_2', trips_id: 't1', cat: 'transport', amount: 418, note: 'Авіаквитки Ryanair туди-назад', date: '2025-07-01' },
            { id: 'ex1_3', trips_id: 't1', cat: 'activity', amount: 290, note: 'Дайвінг-тур', date: '2025-07-05' },
            { id: 'ex1_4', trips_id: 't1', cat: 'food', amount: 380, note: 'Ресторани та кафе', date: '2025-07-03' },
            { id: 'ex1_5', trips_id: 't1', cat: 'transport', amount: 120, note: 'Таксі та квадроцикл', date: '2025-07-02' },
            { id: 'ex1_6', trips_id: 't1', cat: 'other', amount: 252, note: 'Сувеніри та магазини', date: '2025-07-08' }
        ],
        't2': [
            { id: 'ex2_1', trips_id: 't2', cat: 'accommodation', amount: 80, note: 'Hostel Citylights передоплата', date: '2025-10-01' },
            { id: 'ex2_2', trips_id: 't2', cat: 'transport', amount: 40, note: 'Автобус Київ–Львів', date: '2025-10-01' },
            { id: 'ex2_3', trips_id: 't2', cat: 'food', amount: 280, note: 'Кавярні та ресторани Львова', date: '2025-12-16' },
            { id: 'ex2_4', trips_id: 't2', cat: 'activity', amount: 120, note: 'Музеї та екскурсії', date: '2025-12-17' },
            { id: 'ex2_5', trips_id: 't2', cat: 'shopping', amount: 160, note: 'Шоколад та сувеніри', date: '2025-12-19' }
        ],
        't3': [
            { id: 'ex3_1', trips_id: 't3', cat: 'accommodation', amount: 1800, note: 'Hôtel du Louvre 5 ночей', date: '2025-05-10' },
            { id: 'ex3_2', trips_id: 't3', cat: 'transport', amount: 600, note: 'Авіаквитки Air France', date: '2025-05-10' },
            { id: 'ex3_3', trips_id: 't3', cat: 'activity', amount: 80, note: 'Paris Museum Pass', date: '2025-05-11' },
            { id: 'ex3_4', trips_id: 't3', cat: 'food', amount: 420, note: 'Ресторани та булочні', date: '2025-05-12' },
            { id: 'ex3_5', trips_id: 't3', cat: 'transport', amount: 120, note: 'Метро та таксі', date: '2025-05-11' },
            { id: 'ex3_6', trips_id: 't3', cat: 'other', amount: 160, note: 'Сувеніри з Парижа', date: '2025-05-14' }
        ],
        't4': [
            { id: 'ex4_1', trips_id: 't4', cat: 'accommodation', amount: 1500, note: 'B&B Hotel Roma 7 ночей', date: '2026-02-10' },
            { id: 'ex4_2', trips_id: 't4', cat: 'transport', amount: 450, note: 'Авіаквитки WizzAir', date: '2026-02-10' },
            { id: 'ex4_3', trips_id: 't4', cat: 'activity', amount: 700, note: 'Гастро-тур Трастевере', date: '2026-02-13' },
            { id: 'ex4_4', trips_id: 't4', cat: 'food', amount: 340, note: 'Піца, джелато, кава', date: '2026-02-11' },
            { id: 'ex4_5', trips_id: 't4', cat: 'transport', amount: 85, note: 'Метро 48-год квиток', date: '2026-02-10' },
            { id: 'ex4_6', trips_id: 't4', cat: 'activity', amount: 95, note: 'Колізей + Форум', date: '2026-02-12' }
        ],
        't5': [
            { id: 'ex5_1', trips_id: 't5', cat: 'transport', amount: 1500, note: 'Авіаквитки LOT KBP→HND', date: '2025-10-10' },
            { id: 'ex5_2', trips_id: 't5', cat: 'accommodation', amount: 2300, note: 'Shinjuku Granbell Hotel 14 ночей', date: '2025-10-10' },
            { id: 'ex5_3', trips_id: 't5', cat: 'transport', amount: 1000, note: 'JR Pass 14 днів', date: '2025-10-10' },
            { id: 'ex5_4', trips_id: 't5', cat: 'food', amount: 480, note: 'Рамен, суші, якінікy', date: '2025-10-11' },
            { id: 'ex5_5', trips_id: 't5', cat: 'other', amount: 320, note: 'Аніме-шоп Акіхабара', date: '2025-10-16' },
            { id: 'ex5_6', trips_id: 't5', cat: 'activity', amount: 200, note: 'TeamLab Planets + Sensoji', date: '2025-10-13' }
        ],
        't6': [
            { id: 'ex6_1', trips_id: 't6', cat: 'transport', amount: 700, note: 'Авіаквитки FlyPlay', date: '2026-04-01' },
            { id: 'ex6_2', trips_id: 't6', cat: 'transport', amount: 150, note: 'Передоплата авто Dacia Duster', date: '2025-12-01' },
            { id: 'ex6_3', trips_id: 't6', cat: 'accommodation', amount: 495, note: 'Guesthouse передоплата 50%', date: '2025-12-01' },
            { id: 'ex6_4', trips_id: 't6', cat: 'activity', amount: 80, note: 'Blue Lagoon квиток', date: '2025-12-01' }
        ],
        't7': [
            { id: 'ex7_1', trips_id: 't7', cat: 'accommodation', amount: 1800, note: 'Row NYC Hotel 7 ночей', date: '2024-09-01' },
            { id: 'ex7_2', trips_id: 't7', cat: 'transport', amount: 900, note: 'Авіаквитки LOT KBP→JFK', date: '2024-09-01' },
            { id: 'ex7_3', trips_id: 't7', cat: 'activity', amount: 180, note: 'Квиток Hamilton Broadway', date: '2024-09-03' },
            { id: 'ex7_4', trips_id: 't7', cat: 'food', amount: 620, note: 'Ресторани Manhattan + Brooklyn', date: '2024-09-02' },
            { id: 'ex7_5', trips_id: 't7', cat: 'transport', amount: 180, note: 'MetroCard + таксі', date: '2024-09-01' },
            { id: 'ex7_6', trips_id: 't7', cat: 'activity', amount: 120, note: 'Empire State + Central Park bike', date: '2024-09-04' },
            { id: 'ex7_7', trips_id: 't7', cat: 'other', amount: 400, note: 'Шопінг та сувеніри', date: '2024-09-06' }
        ],
        't8': [
            { id: 'ex8_1', trips_id: 't8', cat: 'accommodation', amount: 720, note: 'Hotel Clementin 6 ночей', date: '2025-03-20' },
            { id: 'ex8_2', trips_id: 't8', cat: 'transport', amount: 280, note: 'Авіаквитки WizzAir туди-назад', date: '2025-03-20' },
            { id: 'ex8_3', trips_id: 't8', cat: 'food', amount: 280, note: 'Ресторани та пивоварні', date: '2025-03-21' },
            { id: 'ex8_4', trips_id: 't8', cat: 'activity', amount: 210, note: 'Музеї, Град, Йозефов', date: '2025-03-22' },
            { id: 'ex8_5', trips_id: 't8', cat: 'transport', amount: 80, note: 'Транспортна картка', date: '2025-03-20' },
            { id: 'ex8_6', trips_id: 't8', cat: 'other', amount: 80, note: 'Сувеніри та Trdelník', date: '2025-03-24' }
        ],
        't9': [
            { id: 'ex9_1', trips_id: 't9', cat: 'accommodation', amount: 1200, note: 'Hotel Arts Barcelona 9 ночей', date: '2025-08-05' },
            { id: 'ex9_2', trips_id: 't9', cat: 'transport', amount: 380, note: 'Авіаквитки Vueling', date: '2025-08-05' },
            { id: 'ex9_3', trips_id: 't9', cat: 'activity', amount: 45, note: 'Саграда Фамілія + вежі', date: '2025-08-06' },
            { id: 'ex9_4', trips_id: 't9', cat: 'food', amount: 340, note: 'Паелья, тапас, ринок Бокерія', date: '2025-08-07' },
            { id: 'ex9_5', trips_id: 't9', cat: 'transport', amount: 90, note: 'T-Casual метро 3 картки', date: '2025-08-05' },
            { id: 'ex9_6', trips_id: 't9', cat: 'other', amount: 145, note: 'Сувеніри та пляжні речі', date: '2025-08-10' }
        ],
        't10': [
            { id: 'ex10_1', trips_id: 't10', cat: 'accommodation', amount: 980, note: 'Hotel V Nesplein 7 ночей', date: '2025-06-10' },
            { id: 'ex10_2', trips_id: 't10', cat: 'transport', amount: 420, note: 'Авіаквитки KLM', date: '2025-06-10' },
            { id: 'ex10_3', trips_id: 't10', cat: 'activity', amount: 55, note: 'Canal Boat + Van Gogh Museum', date: '2025-06-12' },
            { id: 'ex10_4', trips_id: 't10', cat: 'transport', amount: 105, note: 'MacBike rent 3 дні', date: '2025-06-11' },
            { id: 'ex10_5', trips_id: 't10', cat: 'food', amount: 280, note: 'Кафе, ринок, stroopwafel', date: '2025-06-11' },
            { id: 'ex10_6', trips_id: 't10', cat: 'other', amount: 140, note: 'Сувеніри та магазини', date: '2025-06-14' }
        ],
        't11': [
            { id: 'ex11_1', trips_id: 't11', cat: 'accommodation', amount: 1540, note: 'Lotte City Hotel 11 ночей', date: '2025-11-01' },
            { id: 'ex11_2', trips_id: 't11', cat: 'transport', amount: 980, note: 'Авіаквитки Asiana', date: '2025-11-01' },
            { id: 'ex11_3', trips_id: 't11', cat: 'food', amount: 480, note: 'Bibimbap, самгьопсаль, стріт-фуд', date: '2025-11-02' },
            { id: 'ex11_4', trips_id: 't11', cat: 'activity', amount: 65, note: 'K-Food Tour Gangnam', date: '2025-11-05' },
            { id: 'ex11_5', trips_id: 't11', cat: 'transport', amount: 280, note: 'T-money картка + метро', date: '2025-11-01' },
            { id: 'ex11_6', trips_id: 't11', cat: 'other', amount: 195, note: 'K-beauty, сувеніри Myeongdong', date: '2025-11-08' }
        ],
        't12': [
            { id: 'ex12_1', trips_id: 't12', cat: 'accommodation', amount: 200, note: 'Hotel Josef передоплата 25%', date: '2025-10-15' },
            { id: 'ex12_2', trips_id: 't12', cat: 'transport', amount: 120, note: 'Авіаквитки передоплата', date: '2025-10-15' },
            { id: 'ex12_3', trips_id: 't12', cat: 'food', amount: 60, note: 'Medovina та трдельнік', date: '2025-12-01' }
        ]
    },

};
