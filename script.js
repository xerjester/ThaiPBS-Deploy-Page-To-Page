                document.addEventListener("DOMContentLoaded", () => {
                    const boat = document.getElementById("ship");
                    const grassLayers = document.querySelectorAll('img[class^="grass-layer"]'); // เก็บทุกหญ้า
                    const ground = document.querySelector('.ground');

                    let isDragging = false;
                    let offsetX = 0;

                    // ป้องกันลากภาพ default
                    boat.ondragstart = (e) => e.preventDefault();

                    // เริ่มลากเรือ
                    boat.addEventListener("mousedown", (e) => {
                        isDragging = true;
                        offsetX = e.clientX - boat.getBoundingClientRect().left;
                        boat.style.cursor = "grabbing";
                        boat.style.animationPlayState = "paused";
                    });

                    // ลากเรือ
                    document.addEventListener("mousemove", (e) => {
                        if (!isDragging) return;

                        let newLeft = e.clientX - offsetX;
                        const boatWidth = boat.offsetWidth;
                        const screenWidth = window.innerWidth;

                        // จำกัดไม่ให้ออกขอบ
                        newLeft = Math.max(0, Math.min(newLeft, screenWidth - boatWidth));
                        boat.style.left = `${newLeft}px`;
                        boat.style.position = "absolute";
                    });

                    // ปล่อยเรือ
                    document.addEventListener("mouseup", () => {
                        if (!isDragging) return;
                        isDragging = false;
                        boat.style.cursor = "grab";
                        boat.style.animationPlayState = "running";
                    });

                    // ฟังก์ชันตรวจหาหญ้า
                    const updateGrass = () => {
                        const boatRect = boat.getBoundingClientRect();
                        const boatXCenter = boatRect.left + boatRect.width / 2; // แกน X ตรงกลางเรือ
                        const boatTop = boatRect.top;
                        const boatBottom = boatRect.bottom;
                        const yThreshold = 200; // ±50px ตรวจแนว Y
                        grassLayers.forEach((g) => {
                            const rect = g.getBoundingClientRect();
                            const grassXCenter = rect.left + rect.width / 2;
                            const grassYCenter = rect.top + rect.height / 2;

                            const isRightSide = grassXCenter > boatXCenter; // หญ้าอยู่หน้าเรือ
                            const isSameYAxis = grassYCenter >= boatTop - yThreshold &&
                                grassYCenter <= boatBottom + yThreshold;
                            if (isRightSide && isSameYAxis) {
                                if (g.src !== location.origin + "/" + g.dataset.hover)
                                    g.src = g.dataset.hover;
                            } else {
                                if (g.src !== location.origin + "/" + g.dataset.original)
                                    g.src = g.dataset.original;
                            }

                        });


                    };

                    // 🔥 Loop ตรวจหญ้าเรียลไทม์
                    const loop = () => {
                        updateGrass();
                        requestAnimationFrame(loop);
                    };
                    loop();
                });

                document.addEventListener("DOMContentLoaded", () => {
                    const waterContainer = document.querySelector('.water-container');
                    const text = document.querySelector('.image-container span');
                    const ship = document.querySelector('.layer11');
                    const ground = document.querySelector('.ground');

                    // ✅ สร้าง observer สำหรับทุก section ที่ต้องการให้เล่นอนิเมชันเมื่อ scroll ถึง
                    const observer = new IntersectionObserver((entries, obs) => {
                        entries.forEach(entry => {
                            if (entry.isIntersecting) {
                                entry.target.classList.add("show");

                                // ✅ เมื่อถึง section test → แสดง water-container
                                if (entry.target.id === "test") {
                                    waterContainer.classList.add("show");
                                    ship.classList.add("show");
                                    ground.classList.add("show");
                                }

                                if (entry.target.id === "map") {
                                    text.classList.add("show");
                                }

                                // หยุดสังเกตเมื่อแอนิเมชันทำงานแล้ว
                                obs.unobserve(entry.target);
                            }
                        });
                    }, { threshold: 0.2 });

                    // ✅ ระบุ element ที่ต้องการให้มีอนิเมชันตอน scroll เข้ามา
                    document.querySelectorAll("#about, #aboutinfo, #abouttext, #test, #picture, .observe, .water-container, .image-container, .pin-btn1, .pin-btn2, .pin-btn3, .pin-btn4, .pin-btn5, .pin-btn6,.pin-btn7 ,.pin-btn8 , .image-container span, .layer11, .orengeContainer1, .orengeContainer2, .orengeContainer3, .testheadtext, .img1, .img2, .img3, .imageBox p, .testContainer h2, #test img\[alt=\"bottom-img\"\], img\[alt=\"img-left\"\], img\[alt=\"img-right\"\], .fourthpage h1, .ground, img\[alt=\"waterbottom-img\"\], .testContainer h1, .testContainer h2,  .imageBox, .imageBox img, .imageBox p, .May.report h1, .may-text, .may-card, .brownContainer1, .brownContainer2, .pollution h1, .brownreport, .report-box, .problem, .critical-image, .critical-text, .fishsec h1, .e-6, .e-2, .e-1, .fishsec h2, .e-3,.e-4, .e-5, .youngmekongriver h1, .f-1, .f-5, .critical-image1, .critical-image2, .critical-image3, .textyoungmekongriver1, .textyoungmekongriver2, .textyoungmekongriver3, .details1 h3, .details2 h3, .details3, .details3 h3, .fishsec .melt-img, .brownreportyoungmekongriver, .brownreportyoungmekongriver1, .brownreportyoungmekongriver2, .sec-6 h1")
                        .forEach(el => observer.observe(el));
                });

                // =======================
                // Scroll Button Logic (แก้ไขแล้ว)
                // =======================
                document.addEventListener('DOMContentLoaded', () => {
                    const scrollUpBtn = document.getElementById('scrollUpBtn');
                    const scrollDownBtn = document.getElementById('scrollDownBtn');

                    let isScrolling = false;
                    const delay = 100; // เพิ่มเวลา delay นิดหน่อยเพื่อให้ animation จบก่อนกดใหม่ได้

                    if (scrollUpBtn && scrollDownBtn) {
                        scrollUpBtn.addEventListener('click', () => {
                            if (isScrolling) return;
                            isScrolling = true;

                            const windowHeight = window.innerHeight;
                            const currentScroll = window.scrollY;

                            // คำนวณหาตำแหน่งหน้าก่อนหน้า (Previous Page)
                            // ใช้ Math.ceil เพื่อปัดเศษขึ้นก่อน แล้วลบ 1 หน้าจอ เพื่อให้มันดีดกลับไปหาจุดเริ่มของหน้าก่อนหน้า
                            let targetY = (Math.ceil(currentScroll / windowHeight) - 1) * windowHeight;

                            // ป้องกันไม่ให้ค่าติดลบ
                            if (targetY < 0) targetY = 0;

                            window.scrollTo({
                                top: targetY,
                                behavior: 'smooth'
                            });

                            setTimeout(() => {
                                isScrolling = false;
                            }, delay);
                        });

                        scrollDownBtn.addEventListener('click', () => {
                            if (isScrolling) return;
                            isScrolling = true;

                            const windowHeight = window.innerHeight;
                            const currentScroll = window.scrollY;

                            // คำนวณหาตำแหน่งหน้าถัดไป (Next Page)
                            // ใช้ Math.floor เพื่อปัดเศษลง (หาจุดเริ่มของหน้าปัจจุบัน) แล้วบวก 1 หน้าจอ
                            let targetY = (Math.floor(currentScroll / windowHeight) + 1) * windowHeight;

                            window.scrollTo({
                                top: targetY,
                                behavior: 'smooth'
                            });

                            setTimeout(() => {
                                isScrolling = false;
                            }, delay);
                        });
                    }
                });

                let slideIndex = 0;

                function currentSlide(n) {
                    showSlides(slideIndex = n);
                }

                function showSlides(n) {
                    const track = document.getElementById('sliderTrack');
                    const dots = document.querySelectorAll('.dot');
                    const slides = document.querySelectorAll('.slide-item');

                    if (n >= slides.length) { slideIndex = 0; }
                    if (n < 0) { slideIndex = slides.length - 1; }

                    track.style.transform = `translateX(-${slideIndex * 100}%)`;

                    dots.forEach(dot => dot.classList.remove('active'));
                    dots[slideIndex].classList.add('active');
                }

                function plusSlides(n) {
                    showSlides(slideIndex += n);
                }

                function showSlides(n) {
                    const track = document.getElementById('sliderTrack');
                    const dots = document.querySelectorAll('.dot');
                    const slides = document.querySelectorAll('.slide-item');
                    if (n >= slides.length) { slideIndex = 0; }
                    if (n < 0) { slideIndex = slides.length - 1; }

                    track.style.transform = `translateX(-${slideIndex * 100}%)`;

                    dots.forEach(dot => dot.classList.remove('active'));
                    if (dots[slideIndex]) {
                        dots[slideIndex].classList.add('active');
                    }
                }