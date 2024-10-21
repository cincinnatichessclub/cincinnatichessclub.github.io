const calendarEl = document.getElementById('calendar');
        const calendar = new FullCalendar.Calendar(calendarEl, {
            initialView: window.innerWidth < 768 ? 'listMonth' : 'dayGridMonth',
            height: 600,
            contentHeight: 580,
            headerToolbar: {
                left: '',
                // left: 'listMonth,dayGridMonth',
                center: 'title',
                right: 'prev,next today'
            },
            aspectRatio: 3,
            themeSystem: 'standard'
        });;


        document.addEventListener('DOMContentLoaded', () => {

            // Get all "navbar-burger" elements
            const $navbarBurgers = Array.prototype.slice.call(document.querySelectorAll('.navbar-burger'), 0);

            // Add a click event on each of them
            $navbarBurgers.forEach(el => {
                el.addEventListener('click', () => {

                    // Get the target from the "data-target" attribute
                    const target = el.dataset.target;
                    const $target = document.getElementById(target);

                    // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
                    el.classList.toggle('is-active');
                    $target.classList.toggle('is-active');

                });
            });

            // Function to create event posts
            function createEventPosts(csvData) {
                // Parse CSV data
                const rows = csvData.split('\n').map(row => row.split(','));
                const headers = rows[0];
                const events = rows.slice(1).map(row => {
                    return headers.reduce((obj, header, index) => {
                        obj[header] = row[index];
                        return obj;
                    }, {});
                });

                // Helper function to format date
                function formatDate(dateString) {
                    const [month, day, year] = dateString.split('/');
                    return new Date(year, month - 1, day).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
                }

                console.log(events);
                insertEventIntoPosts(events);

                // Function to find the next event within a week and format it
                function findAndFormatNextEvent(events) {
                    const currentDate = new Date();
                    const oneWeekFromNow = new Date(currentDate.getTime() + 7 * 24 * 60 * 60 * 1000);

                    // Find the next event within a week
                    const nextEvent = events.find(event => {
                        const eventDate = new Date(event.date);
                        // console.log(eventDate, currentDate, oneWeekFromNow);
                        return eventDate >= currentDate && eventDate <= oneWeekFromNow;
                    });

                    if (nextEvent.length >= 2) {
                        nextEvent = nextEvent[0];
                    }

                    if (!nextEvent) {
                        return "No events found within the next week.";
                    }

                    // Format the event
                    const formattedEvent = `
        <div class="bg-black rounded-xl shadow-md overflow-hidden mt-4 md:w-2xl">
            <div class="lg:flex">
                <div class="md:flex-shrink-0">
                    <img class="h-48 w-full object-cover md:w-60"
                        src="${nextEvent.image}"
                        alt="${nextEvent.title}">
                </div>
                <div class="p-5" style="position: relative;">
                    <p style="position:absolute; top: 5px">Our Next Event</p>
                    <h1 class="title mt-2">
                        <mark class="px-2 pb-1 text-white bg-blue-800 rounded dark:bg-blue-900">${nextEvent.title}</mark>
                        <div class="text-sm text-gray-400 mt-4 ml-2">
                            ${nextEvent.description}
                        </div>
                        <div class="flex items-center ml-2 mt-2">
                            <svg class="h-4 w-4 text-gray-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24"
                                stroke="currentColor" width="30" height="30">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <div class="flex items-center"></div>
                            <span class="text-sm text-gray-500">${nextEvent.date}</span>
                            <span class="text-sm text-gray-700 mx-2">${nextEvent.time_start} - ${nextEvent.time_end}</span>
                        </div>
                        <div class="flex items-center mx-2">
                            <a href="${nextEvent.location}" target="_blank"
                                class="flex items-center text-blue-500 hover:text-blue-600">
                                <svg class="h-4 w-4 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24"
                                    stroke="currentColor" width="30" height="30">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                <span class="text-sm">Location</span>
                            </a>
                        </div>
                    </h1>
                </div>
            </div>
        </div>
    `;

                    return formattedEvent;
                }

                function getDateObject(date, time) {
                    const [month, day, year] = date.split('/');
                    const [hours, minutes] = time.split(':');
                    return new Date(year, month - 1, day, hours, minutes);
                }

                for (let event of events) {

                    calendar.addEvent({
                        title: event.title,
                        start: getDateObject(event.date, event.time_start),
                        end: getDateObject(event.date, event.time_end),
                        className: "fc-event-success",
                        // classNames: ['text-white'],
                        // display: 'list-item',
                        eventDisplay: 'list-item',


                        displayEventTime: true,
                        // allDay: false,
                        // extendedProps: {
                        //     color: 'yellow',
                        //     eventTextColor: 'black',
                        //     // description: event.description,
                        //     image: event.image,
                        //     location: event.location
                        // }
                    });
                }


                console.log(calendar.getEvents());


                calendar.render();

                // Function to insert the formatted event into the DOM
                async function insertEventIntoPosts(events) {
                    const formattedEvent = await findAndFormatNextEvent(events);
                    const postsDiv = document.getElementById('posts');

                    if (postsDiv) {
                        postsDiv.innerHTML = formattedEvent;
                    } else {
                        console.error("Couldn't find the 'posts' div");
                    }
                }
            }

            // Function to load data and create event posts
            function loadDataAndCreatePosts() {
                var sheet_id = "2PACX-1vQSR2L38yt9rcX5YNlczXe55AIQKdbqqvzjP_3jM_nj94jBR74VmpwfwwuEue_j9M9FsnRbSwO0ffeb";
                var url = `https://docs.google.com/spreadsheets/d/e/${sheet_id}/pub?gid=0&single=true&output=csv`;

                fetch(url)
                    .then(response => response.text())
                    .then(data => {
                        const eventPostsHTML = createEventPosts(data);
                        document.getElementById('posts').innerHTML = eventPostsHTML;
                    })
                    .catch(error => console.error('Error:', error));
            }

            // Call the function to load data and create posts
            loadDataAndCreatePosts();

            // calendar = new FullCalendar.Calendar(calendarEl, {
            //     initialView: 'dayGridMonth'
            // });

        });
