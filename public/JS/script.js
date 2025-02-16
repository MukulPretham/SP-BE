
//Returns array, consisting songs names
async function getSongs(num) {
    let songProm = await fetch("https://spotify-api-1-3vqh.onrender.com");
    let obj = await songProm.json();
    let links = obj[num];
    let songs = [];
    for (const element of links) {
        songs.push(element.split("128-")[1].replaceAll("%20", " ").split("128 Kbps.mp3")[0]);
        // songs.push(element.href);
    }
    return songs;
}

//Returns array, consisting .mp3 links of the songs.
async function getSONGS(num) {
    let songProm = await fetch("https://spotify-api-1-3vqh.onrender.com");
    let obj = await songProm.json();
    let links = obj[num];
    let SONGS = [];
    for (const element of links) {
        SONGS.push(element);
    }
    return SONGS;
}

//Returns background images of the songs.
// async function getBGS() {
//     let BGSprom = await fetch("http://192.168.0.155:3000/backgroundImgs.html");
//     let response = await BGSprom.text();
//     let div = document.createElement("div");
//     div.innerHTML = response;
//     let bgs = div.getElementsByClassName("bg");
//     let BGS = [];
//     for (const element of bgs) {
//         BGS.push(element.src);
//     }
//     return BGS;
// }
let currentAudio = null;
let seekBar = document.querySelector(".seekBar");
document.querySelectorAll(".play").forEach(playBtn => {
    playBtn.addEventListener("click", async (e) => {
        if (currentAudio) {
            currentAudio.pause();
        }
        let playing = false;
        let currentIndex = 0;

        let volSeek = document.querySelector(".volSeek");
        document.querySelectorAll("ol div").forEach(div => div.remove());

        let card = e.target.closest(".card-img"); // Find the closest parent with class "card-img"
        let title = card.nextElementSibling; // The .img-title div is the next sibling
        let string = title.textContent;
        let num = string.charAt(0)
        //Getting the songs.
        let songs = await getSongs(num);
        console.log(songs);
        let SONGS = await getSONGS(num);
        console.log(SONGS);
        // let BGS = await getBGS();
        currentAudio = new Audio(SONGS[currentIndex]);
        currentAudio.play();
        let info = document.querySelector(".song-info");
        info.innerHTML = songs[0];
        if (playing) {
            currentAudio.pause();
            playing = false;
            let play = document.querySelector(".PLAY").getElementsByTagName("img")[0];
            play.src = "./logos/play.svg";
        } else {
            currentAudio.play();
            playing = true;
            let play = document.querySelector(".PLAY").getElementsByTagName("img")[0];
            play.src = "./logos/pause.svg";
        }

        currentAudio.addEventListener("loadedmetadata", () => {
            if (currentAudio) {
                seekBar.max = currentAudio.duration;
            }
        });

        //seekbar starts at 0 when every play btn pressed.
        currentAudio.addEventListener("timeupdate", () => {
            if (currentAudio) {
                seekBar.value = currentAudio.currentTime;
            }
        });

        //Adding songs to playlist.
        for (const element of songs) {
            let songOL = document.querySelector(".songList").getElementsByTagName("ol")[0];
            songOL.innerHTML = songOL.innerHTML + `<div class="playNow">
                        <li>${element}</li>
                        <img class="hover" src="./logos/play-song.svg" alt="">
                    </div>`;
        }


        let buttons = document.querySelectorAll(".playNow img");
        buttons.forEach((button, index) => {
            //Playing Song.
            button.addEventListener("click", () => {
                currentIndex = index;
                if (currentAudio) {
                    currentAudio.pause();
                    currentAudio.currentTime = 0;
                }
                let info = document.querySelector(".song-info");
                info.innerHTML = songs[currentIndex];
                currentAudio = new Audio(SONGS[currentIndex]);
                currentAudio.play();
                playing = true;
                if (playing) {
                    let play = document.querySelector(".PLAY").getElementsByTagName("img")[0];
                    play.src = "./logos/pause.svg";
                }

                //Adding background image of the current song.
                // let bg = document.querySelector(".song-img");
                // bg.style.backgroundImage = `url(${BGS[currentIndex]})`;
                // bg.style.backgroundSize = "cover";

                //Seekbar max value is set as the songs loads.
                currentAudio.addEventListener("loadedmetadata", () => {
                    if (currentAudio) {
                        seekBar.max = currentAudio.duration;
                    }
                });

                //seekbar starts at 0 when every play btn pressed.
                currentAudio.addEventListener("timeupdate", () => {
                    if (currentAudio) {
                        seekBar.value = currentAudio.currentTime;
                    }
                });

                volSeek.value = 10;

            })
        })

        let play = document.querySelector(".play-btn");
        play.addEventListener("click", () => {
            if (playing) {
                currentAudio.pause();
                playing = false;
                let play = document.querySelector(".PLAY").getElementsByTagName("img")[0];
                play.src = "./logos/play.svg";
            } else {
                currentAudio.play();
                playing = true;
                let play = document.querySelector(".PLAY").getElementsByTagName("img")[0];
                play.src = "./logos/pause.svg";
            }
        })

        let next = document.querySelector(".next");
        next.addEventListener("click", () => {
            if (currentIndex == SONGS.length - 1) {
                currentIndex = 0;
            } else {
                currentIndex++;
            }
            if (currentAudio) {
                currentAudio.pause();
                currentAudio.currentTime = 0;
            }
            currentAudio = new Audio(SONGS[currentIndex]);
            currentAudio.play();

            let info = document.querySelector(".song-info");
            info.innerHTML = songs[currentIndex];

            // let bg = document.querySelector(".song-img");
            // bg.style.backgroundImage = `url(${BGS[currentIndex]})`;
            // bg.style.backgroundSize = "cover";

            //Seekbar max value is set as the songs loads.
            currentAudio.addEventListener("loadedmetadata", () => {
                if (currentAudio) {
                    seekBar.max = currentAudio.duration;
                }
            });

            //seekbar starts at 0 when every play btn pressed.
            currentAudio.addEventListener("timeupdate", () => {
                if (currentAudio) {
                    seekBar.value = currentAudio.currentTime;
                }
            });

            volSeek.value = 10;
        })

        let prev = document.querySelector(".prev");
        prev.addEventListener("click", () => {
            if (currentIndex == 0) {
                currentIndex = SONGS.length - 1;
            } else {
                currentIndex--;
            }
            if (currentAudio) {
                currentAudio.pause();
                currentAudio.currentTime = 0;
            }
            currentAudio = new Audio(SONGS[currentIndex]);
            currentAudio.play();

            let info = document.querySelector(".song-info");
            info.innerHTML = songs[currentIndex];

            // let bg = document.querySelector(".song-img");
            // bg.style.backgroundImage = `url(${BGS[currentIndex]})`;
            // bg.style.backgroundSize = "cover";

            //Seekbar max value is set as the songs loads.
            currentAudio.addEventListener("loadedmetadata", () => {
                if (currentAudio) {
                    seekBar.max = currentAudio.duration;
                }
            });

            //seekbar starts at 0 when every play btn pressed.
            currentAudio.addEventListener("timeupdate", () => {
                if (currentAudio) {
                    seekBar.value = currentAudio.currentTime;
                }
            });

            volSeek.value = 10;
        })

        // we can change the currentTime of the song by draging
        seekBar.addEventListener("input", (e) => {
            if (currentAudio) {
                currentAudio.currentTime = e.target.value;
            }
        });

        // Evey time the time updates 
        if (currentAudio) {
            currentAudio.addEventListener("timeupdate", () => {
                if (currentAudio) {
                    seekBar.value = currentAudio.currentTime;
                }
            });
        }


        //Volume adjusting.

        volSeek.addEventListener("input", (e) => {
            if (currentAudio) {
                currentAudio.volume = (e.target.value) / 10;
            }
        })
        //auto play.
        setInterval(() => {
            if (currentAudio.currentTime >= currentAudio.duration) {
                document.querySelector(".next").click();
                currentAudio.play();
            }
        }, 500);

    });
});



let ham = false;
//setting up hamburger feature
let hamBurger = document.querySelector(".hamburger");
let aside = document.getElementsByTagName("aside")[0];
hamBurger.addEventListener("click", () => {
    if (aside.style.left == "-100%") {
        aside.style.left = "0";
        ham = true;
        let hamLogo = document.querySelector(".hamburger");
        hamLogo.src = "./logos/hamClose.svg"
    } else {
        aside.style.left = "-100%";
        ham = false;
        let hamLogo = document.querySelector(".hamburger");
        hamLogo.src = "./logos/hamburger.svg"
    }
})