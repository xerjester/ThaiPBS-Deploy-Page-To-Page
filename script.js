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
                    // 1. เลือก Elements ที่ต้องการให้มี Animation (หัวข้อ, รูป, กล่องข้อความ, การ์ด)
                    const elementsToAnimate = document.querySelectorAll(`
        h1, h2, h3, p, 
        .stat-card, 
        .image-wrapper, 
        .slide-item, 
        .box-white, 
        .box-orange,
        .chart-box, 
        .sec10-right,
        .imageBox,
        .may-inforright,
        .may-videoleft,
        .brown-boxright,
        .brown-boxleft,
        .ref-content p,
        .image-fishing,
        .image-fishing1,
        .text-fishing,
        .text-fishing1,
        .sec16-question,
        .game-btn,
        .sec17-title,
        .main-title
    `);

                    // 2. ใส่ class 'reveal' ให้ทุกตัวที่เลือก (เพื่อซ่อนก่อน)
                    elementsToAnimate.forEach(el => {
                        el.classList.add('reveal');
                    });

                    // 3. สร้าง Observer
                    const observer = new IntersectionObserver((entries, obs) => {
                        entries.forEach(entry => {
                            if (entry.isIntersecting) {
                                // เมื่อเลื่อนมาเจอ ให้ใส่ class 'active' (เพื่อให้ลอยขึ้นมา)
                                entry.target.classList.add('active');

                                // (Optional) หยุดสังเกตเพื่อไม่ให้เล่นซ้ำไปซ้ำมา
                                obs.unobserve(entry.target);
                            }
                        });
                    }, {
                        threshold: 0.15, // ต้องเห็นสัก 15% ก่อนถึงจะเล่น
                        rootMargin: "0px 0px -50px 0px" // ให้เลยขอบล่างจอมานิดนึงค่อยเล่น
                    });

                    // 4. เริ่มจับตาดูทุกตัว
                    elementsToAnimate.forEach(el => {
                        observer.observe(el);
                    });

                    // --- จัดการ Animation พิเศษ (ของเดิมที่มีอยู่) ---
                    const specificObserver = new IntersectionObserver((entries) => {
                        entries.forEach(entry => {
                            if (entry.isIntersecting) {
                                // Sec-3: น้ำและเรือ
                                if (entry.target.classList.contains('water-container')) {
                                    entry.target.classList.add("show");
                                    const ship = document.querySelector('.layer11');
                                    const ground = document.querySelector('.ground');
                                    if (ship) ship.classList.add("show");
                                    if (ground) ground.classList.add("show");
                                }
                                // Sec-2: แผนที่
                                if (entry.target.classList.contains('image-container')) {
                                    entry.target.classList.add("show");
                                    // ดีเลย์ให้ปุ่มหมุดเด้งตามมา
                                    document.querySelectorAll('[class^="pin-btn"]').forEach(btn => btn.classList.add('show'));
                                }
                                // Sec-10: กราฟ
                                if (entry.target.classList.contains('sec-10')) {
                                    entry.target.classList.add("show");
                                }
                            }
                        });
                    }, { threshold: 0.2 });

                    // สังเกตตัวพิเศษ
                    const specialElements = document.querySelectorAll('.water-container, .image-container, .sec-10');
                    specialElements.forEach(el => specificObserver.observe(el));
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
                // Scroll Button Logic (ฉบับแม่นยำ 100%)
                // =======================
                document.addEventListener('DOMContentLoaded', () => {
                    const scrollUpBtn = document.getElementById('scrollUpBtn');
                    const scrollDownBtn = document.getElementById('scrollDownBtn');

                    // เก็บรายชื่อ Section ทั้งหมดที่ต้องการให้เลื่อนผ่าน
                    // (คุณสามารถเพิ่ม class หรือ id อื่นๆ ที่เป็น section หลักได้ที่นี่)
                    const sections = Array.from(document.querySelectorAll('header, section.full-section'));

                    if (!scrollUpBtn || !scrollDownBtn) return;

                    // ฟังก์ชันหา Section ปัจจุบันที่อยู่บนหน้าจอมากที่สุด
                    function getCurrentSectionIndex() {
                        const scrollY = window.scrollY + (window.innerHeight / 2); // จุดกึ่งกลางจอ

                        // หา index ของ section ที่ครอบจุดกึ่งกลางจออยู่
                        let index = sections.findIndex(sec => {
                            const rect = sec.getBoundingClientRect();
                            const absoluteTop = rect.top + window.scrollY;
                            const absoluteBottom = absoluteTop + rect.height;
                            return scrollY >= absoluteTop && scrollY < absoluteBottom;
                        });

                        return index === -1 ? 0 : index;
                    }

                    // ปุ่มเลื่อนขึ้น
                    scrollUpBtn.addEventListener('click', () => {
                        const currentIndex = getCurrentSectionIndex();
                        if (currentIndex > 0) {
                            sections[currentIndex - 1].scrollIntoView({ behavior: 'smooth' });
                        }
                    });

                    // ปุ่มเลื่อนลง
                    scrollDownBtn.addEventListener('click', () => {
                        const currentIndex = getCurrentSectionIndex();
                        if (currentIndex < sections.length - 1) {
                            sections[currentIndex + 1].scrollIntoView({ behavior: 'smooth' });
                        }
                    });
                });

                // =======================
                // Slider Logic (Sec-7) - แก้ไขแล้ว
                // =======================
                let slideIndex = 0;

                // ฟังก์ชันกดที่จุด (Dot)
                function currentSlide(n) {
                    showSlides(slideIndex = n);
                }

                // ฟังก์ชันกดปุ่ม Next/Prev
                function plusSlides(n) {
                    showSlides(slideIndex += n);
                }

                function showSlides(n) {
                    const track = document.getElementById('sliderTrack');

                    // ⭐ แก้ตรงนี้: หา slide-item เฉพาะที่อยู่ใน sliderTrack เท่านั้น
                    // เพื่อไม่ให้ไปนับรวมกับของ Sec-18
                    const slides = track.querySelectorAll('.slide-item');

                    const dots = document.querySelectorAll('.slider-dots .dot'); // เจาะจง class แม่ของ dot ด้วย

                    // ตรวจสอบเงื่อนไขวนลูป
                    if (n >= slides.length) { slideIndex = 0; }
                    if (n < 0) { slideIndex = slides.length - 1; }

                    // สั่งเลื่อน
                    track.style.transform = `translateX(-${slideIndex * 100}%)`;

                    // อัปเดตจุดสี
                    dots.forEach(dot => dot.classList.remove('active'));
                    if (dots[slideIndex]) {
                        dots[slideIndex].classList.add('active');
                    }
                }
                // เพิ่มการ Observe เฉพาะ Sec-10 เพื่อเล่นกราฟ
                document.addEventListener("DOMContentLoaded", () => {
                    const sec10 = document.querySelector(".sec-10");
                    if (sec10) {
                        const observerSec10 = new IntersectionObserver((entries) => {
                            entries.forEach(entry => {
                                if (entry.isIntersecting) {
                                    entry.target.classList.add("show");
                                }
                            });
                        }, { threshold: 0.3 });
                        observerSec10.observe(sec10);
                    }
                });
                document.addEventListener("DOMContentLoaded", () => {
                    const popupOverlay = document.getElementById('mobile-popup');
                    const popupBody = document.getElementById('popup-body');

                    // ⭐ แก้จาก: const closeBtn = document.querySelector('.close-btn');
                    // ⭐ เป็น:
                    const closeBtn = popupOverlay.querySelector('.close-btn');
                    // (ใช้ popupOverlay.querySelector เพื่อหาปุ่มเฉพาะในกล่องนี้เท่านั้น)

                    const allPins = document.querySelectorAll('[class^="pin-btn"]');

                    // ฟังก์ชันเปิด Popup
                    function openPopup(content) {
                        popupBody.innerHTML = content;
                        popupOverlay.classList.add('active');
                    }

                    // ฟังก์ชันปิด Popup
                    function closePopup() {
                        popupOverlay.classList.remove('active');
                    }

                    // วนลูปเช็คทุกปุ่มหมุด
                    allPins.forEach(pin => {
                        pin.addEventListener('click', (e) => {
                            // ทำงานเฉพาะหน้าจอเล็กกว่า 900px (มือถือ/แท็บเล็ต)
                            if (window.innerWidth <= 900) {
                                e.stopPropagation(); // ป้องกันไม่ให้ event ชนกัน

                                // หา info-card ข้างในปุ่มนั้น
                                const infoCard = pin.querySelector('.info-card');

                                if (infoCard) {
                                    // ส่งเนื้อหา HTML ไปให้ Popup แสดง
                                    openPopup(infoCard.innerHTML);
                                }
                            }
                        });
                    });

                    if (closeBtn) { // เพิ่มการเช็คกัน error เล็กน้อย
                        closeBtn.addEventListener('click', closePopup);
                    }

                    // กดพื้นที่ว่างๆ (Backdrop) เพื่อปิด
                    popupOverlay.addEventListener('click', (e) => {
                        if (e.target === popupOverlay) {
                            closePopup();
                        }
                    });
                });

                const quizData = [{
                        question: "1.คุณมีความโดดเด่นขนาดในกลุ่มเพื่อนอย่างไร ? ",
                        options: [
                            { text: "คุณเป็นคนตัวใหญ่ใจดีดูเป็นที่พึ่งพา", score: 1, fish: 0 },
                            { text: "คุณดูสงบ หนักแน่น เป็นผู้นำที่สุขุม", score: 2, fish: 1 },
                            { text: "คุณดูเงียบๆ แต่มีความลับซ่อนอยู่", score: 3, fish: 2 },
                            {
                                text: "คุณเป็นคนเรียบง่าย ไม่ชอบความวุ่นวายชอบซุ่ม ดูสถานการณ์ ",
                                score: 4,
                                fish: 3
                            },
                            {
                                text: "คุณเป็นคนมีบุคลิกเฉพาะตัว บางครั้งก็มีมุมที่ดูแปลกหรือโดดเด่นไม่เหมือนใคร ",
                                score: 5,
                                fish: 4
                            },
                        ]
                    },
                    {
                        question: "2.คุณเลือกทำกิจกรรมยามว่างแบบไหน?",
                        options: [
                            { text: "ทำกิจกรรมที่ต้องใช้พลังงานในสภาพ แวดล้อมที่ท้าทาย (เช่น เดินป่า ,ปีนเขา)", score: 1, fish: 0 },
                            { text: "ผ่อนคลายในบรรยากาศสบายๆเงียบๆ ใกล้ชิดธรรมชาติ", score: 2, fish: 1 },
                            { text: "ออกไปสำรวจหรือปาร์ตี้ในตอนกลางคืน", score: 3, fish: 2 },
                            { text: "นั่งพักผ่อนและทำสมาธิคนเดียวอยู่กับพื้น", score: 4, fish: 3 },
                            { text: "ศึกษาหาความรู้หรือทำกิจกรรมที่ ต้องใช้ความคิดวิเคราะห์", score: 5, fish: 4 }
                        ]
                    },
                    {
                        question: "3.คุณมีวิธีการรับมือกับความขัดแย้งอย่างไร?",
                        options: [
                            { text: "เน้นความสุภาพหลีกเลี่ยงการเผชิญหน้าโดยตรง", score: 1, fish: 0 },
                            { text: "ใช้ความสงบสยบความเคลื่อนไหว ไม่ค่อยสนใจเรื่องวุ่นวาย", score: 2, fish: 1 },
                            { text: "คอยสังเกตการณ์หากจำเป็นก็พร้อมป้องกันตัวเองอย่างรวดเร็ว", score: 3, fish: 2 },
                            { text: "คุณจะนิ่งอยู่กับที่ ไม่ตอบโต้ แต่หากถูกจู่โจมก็มีวิธีป้องกันที่เด็ดขาด", score: 4, fish: 3 },
                            { text: "ใช้เหตุผลและลักษณะที่โดดเด่นของคุณในการสร้างความน่าเชื่อถือ", score: 5, fish: 4 }
                        ]
                    },
                    {
                        question: "4.ถ้าให้เลือกอาหารมื้อหลัก คุณจะเลือกอะไร?",
                        options: [
                            { text: "อาหารที่มาจากพืชเป็นหลัก (มังสวิรัติ)", score: 1, fish: 0 },
                            { text: "ผลไม้หรือของว่างหวานๆจากธรรมชาติ", score: 2, fish: 1 },
                            {
                                text: "อาหารรสจัด เนื้อสัตว์หรืออาหารที่ต้องใช้ \"การล่า\"",
                                score: 3,
                                fish: 2
                            }, { text: "อาหารทะเลหรืออาหารที่ต้องแกะ", score: 4, fish: 3 },
                            { text: "อาหารที่มีความหลากหลาย หรืออาหารที่ต้องใช้ความพยายามในการได้มา", score: 5, fish: 4 }
                        ]
                    },
                    {
                        question: "5.เมื่อต้องทำงานกลุ่ม คุณชอบบทบาทแบบไหน?",
                        options: [
                            { text: "ทำหน้าที่ที่ต้องใช้ความอดทนและความใหญ่โต เช่น ขนของหรือจัดการทรัพยากร", score: 1, fish: 0 },
                            { text: "เป็นที่ปรึกษาที่ใจเย็นคอยดูแลให้ทุกคนสงบ", score: 2, fish: 1 },
                            { text: "ทำงานเบื้องหลังมักจะจัดการงานที่ต้องใช้ความชำนาญตอนกลางคืน", score: 3, fish: 2 },
                            { text: "เป็นคนเก็บรายละเอียดคอยระวังไม่ให้เกิดความผิดพลาด", score: 4, fish: 3 },
                            { text: "เป็นผู้เชี่ยวชาญเฉพาะด้านที่คนอื่นมักต้องมาขอคำแนะนำ", score: 5, fish: 4 }
                        ]
                    },
                ];

                const fishes = [{
                        name: " ปลาบึก (Mekong Giant Catfish)  ",
                        image: "assets/fish/8.png",
                        description: "คุณคือยักษ์ใหญ่ผู้ใจดี! คุณเป็นคนสุภาพ อ่อนโยน มีขนาดร่างกายหรือความคิดที่ใหญ่โต ชอบอยู่ในสภาพแวดล้อมที่ท้าทาย และเป็นมังสวิรัติทางจิตใจ (ไม่ชอบการทำร้ายใคร)"
                    },
                    {
                        name: "ปลาคูน (Giant Barb / ปลากะโห้)",
                        image: "assets/fish/3.png",
                        description: "คุณคือผู้ทรงภูมิแห่งน้ำลึก! คุณเป็นคนสงบ หนักแน่น สุขุม และไม่ดุร้าย คุณชอบความเรียบง่ายและธรรมชาติ มักจะอยู่เป็นคู่หรือกลุ่มเล็ก ๆ และมีความสุขกับการใช้ชีวิตอย่างช้า ๆ"
                    },
                    {
                        name: "ปลาเอิน (Spotted Featherback)",
                        image: "assets/fish/7.png",
                        description: "คุณคือพรานเงาผู้มีเสน่ห์! คุณเป็นคนมีเสน่ห์ดึงดูด มีลายจุด (บุคลิก) ที่เป็นเอกลักษณ์ แต่ค่อนข้างดุและคล่องแคล่ว คุณชอบทำงานหรือทำกิจกรรมในยามค่ำคืน และเก่งในการซ่อนตัว"
                    },
                    {
                        name: "กระเบนราหูน้ำจืด (Giant Freshwater Stingray)",
                        image: "assets/fish/9.png",
                        description: "คุณคือนักซุ่มผู้สงบ! คุณเป็นคนเรียบง่าย ไม่ชอบแสดงตัว ชอบฝังตัวอยู่กับพื้นดินหรือพื้นทราย (อยู่กับความเป็นจริง) แม้จะดูสงบ แต่หากถูกรบกวน คุณมีกลไกการป้องกันตัวเองที่เด็ดขาดและเฉียบคม"
                    },
                    {
                        name: "ปลาหว่าหน้านอ (Incisilabeo behri)",
                        image: "assets/fish/10.png",
                        description: "คุณคือผู้เชี่ยวชาญที่มีเอกลักษณ์! คุณเป็นคนที่มีบุคลิกโดดเด่นหรือมีความรู้เฉพาะตัวที่น่าสนใจ (เหมือน \"นอ\" ที่หน้าผาก) คุณเป็นที่ต้องการตัวในฐานะผู้เชี่ยวชาญ และแม้ว่าอาจจะพบได้ยากในกลุ่มสังคม แต่ก็มีคุณค่าและเป็นที่ยอมรับ"
                    }
                ];

                let currentQuestion = 0;
                let score = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0 };
                let selectedFish = 0;

                function showQuiz() {
                    document.getElementById('quizModal').classList.add('active');
                }

                function closeQuiz() {
                    document.getElementById('quizModal').classList.remove('active');
                }

                function startQuiz() {
                    currentQuestion = 0;
                    score = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0 };
                    document.getElementById('introScreen').classList.remove('active');
                    document.getElementById('questionScreen').classList.add('active');
                    loadQuestion();
                }

                function loadQuestion() {
                    const question = quizData[currentQuestion];
                    const progress = ((currentQuestion + 1) / quizData.length) * 100;

                    document.getElementById('progressFill').style.width = progress + '%';
                    document.getElementById('questionNumber').textContent = `คำถามที่ ${currentQuestion + 1} / ${quizData.length}`;
                    document.getElementById('questionText').textContent = question.question;

                    const optionsHTML = question.options.map((option, index) =>
                        `<button class="option-btn" onclick="selectOption(${index})">${option.text}</button>`
                    ).join('');

                    document.getElementById('optionsContainer').innerHTML = optionsHTML;
                }

                function selectOption(index) {
                    const question = quizData[currentQuestion];
                    const option = question.options[index];

                    score[option.fish]++;

                    currentQuestion++;

                    if (currentQuestion < quizData.length) {
                        loadQuestion();
                    } else {
                        showResult();
                    }
                }

                function showResult() {
                    const maxScore = Math.max(score[0], score[1], score[2], score[3], score[4]);
                    selectedFish = Object.keys(score).find(key => score[key] === maxScore);

                    document.getElementById('questionScreen').classList.remove('active');
                    document.getElementById('resultScreen').classList.add('active');

                    const fish = fishes[selectedFish];
                    document.getElementById('fishEmoji').innerHTML = `<img src="${fish.image}" class="fish-img">`;
                    document.getElementById('fishName').textContent = fish.name;
                    document.getElementById('scoreDisplay').textContent = `คะแนน: ${score[selectedFish]} คะแนน`;
                    document.getElementById('fishDescription').textContent = fish.description;
                }

                function restartQuiz() {
                    document.getElementById('resultScreen').classList.remove('active');
                    document.getElementById('introScreen').classList.add('active');
                }

                document.getElementById('openPopup').addEventListener('click', showQuiz);

                // =======================
                // Story Slider Logic (Sec-18)
                // =======================
                let storyIndex = 0;

                function currentStorySlide(n) {
                    showStorySlides(storyIndex = n);
                }

                function plusStorySlides(n) {
                    showStorySlides(storyIndex += n);
                }

                function showStorySlides(n) {
                    const track = document.getElementById('storyTrack');
                    const dots = document.querySelectorAll('.dot-story');
                    const slides = track.querySelectorAll('.slide-item'); // หา slide เฉพาะใน track นี้

                    if (n >= slides.length) { storyIndex = 0; }
                    if (n < 0) { storyIndex = slides.length - 1; }

                    if (track) {
                        track.style.transform = `translateX(-${storyIndex * 100}%)`;
                    }

                    dots.forEach(dot => dot.classList.remove('active'));
                    if (dots[storyIndex]) {
                        dots[storyIndex].classList.add('active');
                    }
                }

                /* ======================================================
   ADDON: Sec-4 Plant Popup Logic
   (คลิกที่ต้นไม้ใน Sec-4 แล้วเด้ง Popup ข้อมูล)
====================================================== */
                document.addEventListener("DOMContentLoaded", () => {
                    // 1. ตัวแปรสำหรับ Popup (ใช้ตัวเดียวกับของแผนที่)
                    const popupOverlay = document.getElementById('mobile-popup');
                    const popupBody = document.getElementById('popup-body');
                    const plantBoxes = document.querySelectorAll('.sec-4 .imageBox');

                    // 2. ฟังก์ชันเปิด Popup
                    function openPlantPopup(name, desc, imgSrc) {
                        // สร้าง HTML สำหรับใส่ใน Popup
                        const content = `
            <div style="text-align: center; padding: 10px;">
                <h3 style="color: orangered; font-size: 24px; margin-bottom: 10px;">${name}</h3>
                <div style="width: 60px; height: 3px; background: #e95a0c; margin: 0 auto 15px auto;"></div>
                <p style="text-align: left; color: #333; font-size: 16px; line-height: 1.6;">
                    ${desc}
                </p>
            </div>
        `;

                        popupBody.innerHTML = content;
                        popupOverlay.classList.add('active'); // สั่งให้แสดงผล
                    }

                    // 3. วนลูปใส่ Event Click ให้ทุกกล่อง
                    plantBoxes.forEach(box => {
                        box.addEventListener('click', () => {
                            const name = box.getAttribute('data-name'); // ดึงชื่อ
                            const desc = box.getAttribute('data-desc'); // ดึงคำบรรยาย
                            const img = box.querySelector('img').src; // ดึงรูปภาพเดิมมาโชว์

                            if (name && desc) {
                                openPlantPopup(name, desc, img);
                            }
                        });
                    });

                    // หมายเหตุ: ปุ่มปิด (X) ทำงานได้อยู่แล้วจากโค้ดชุดเดิมของ Map Popup
                });