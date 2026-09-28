
        // Disable browser scroll restoration and force the page to start from the top
        if ('scrollRestoration' in history) {
            history.scrollRestoration = 'manual';
        }

        window.addEventListener('beforeunload', function () {
            window.scrollTo(0, 0);
        });

        window.addEventListener('load', function () {
            setTimeout(function() {
                window.scrollTo(0, 0);
            }, 0);
        });

        const translations = {
            en: {
                name: "M ALASHRAF TOLIMAT",
                tagline: "GAME PROGRAMMER IN THE MAKING – BRIDGING CODE, CREATIVITY, AND CORE GAMEPLAY",
                studentAt: "Student at TECHNOS COLLEGE, Tokyo",
                btnProjects: "VIEW PROJECTS",
                btnCV: "DOWNLOAD CV",
                btnDemo: "Play Demo on itch.io",
                btnGDD: "Read Full GDD",
                aboutTitle: "ABOUT ME",
                aboutDesc: "A Syrian student and aspiring game developer based in Tokyo. Currently studying at Technos College, focusing on game programming with Unity and C#. I blend modern technologies and AI tools to build engaging gameplay systems. Ready to work both on-site and remotely.",
                aboutHobby: "Away from the screen I build plastic model kits — especially Macross mecha. Once I start one, hours disappear and I completely forget my surroundings.",
                projectsTitle: "FEATURED WORKS",
                p1Title: "Sol Frame",
                p1Desc: "Chicken Invaders style space shooter game.",
                p1DescLong: "A classic arcade space shooter inspired by Chicken Invaders style gameplay. Developed in Unity.",
                p2Title: "3D Environments",
                p2Desc: "3D environmental models including station and campus.",
                p2DescLong: "A full 3D reconstruction of Musashi-Koganei Station and Technos College campus in Maya. Modelling, texturing and lighting built from photo reference.",
                p3Title: "Pixel Art & Design",
                p3Desc: "Character, UI, and level design concepts created in Photoshop.",
                p3DescLong: "A collection of graphic design work created in Photoshop, including UI/UX mockups, educational posters, and 8-bit character sprites with a focus on readable silhouettes.",
                p4Title: "Tokyo Game Show 2024",
                p4Desc: "Meeting the Digital Extremes team after 11 years.",
                p4DescLong: "After 11 years of playing Warframe and watching Devstreams, I finally met the faces behind the screen. It felt like a heartfelt family reunion, and I had an incredibly inspiring and warm conversation with the Digital Extremes team.",
                p5Title: "Echoes of Damascus",
                p5Desc: "A lyrical 2D platformer GDD & proposal featuring multi-language support.",
                p6Title: "Barjees Board Game",
                p6Desc: "A complete Game Design Document modernizing the traditional board game.",
                skillsTitle: "SKILLS & LANGUAGES",
                skills_GameDev: "Game Dev",
                skills_Code: "Code",
                skills_Design: "Design",
                skills_Audio: "Audio",
                skills_PCBuild: "PC Building",
                skills_TechRepair: "Tech Repair",
                chip_Gameplay: "Gameplay",
                chip_AITools: "AI Tools",
                chip_UIUX: "UI/UX",
                chip_SoundDesign: "Sound Design",
                chip_Assembly: "Assembly",
                chip_Teardown: "Teardown",
                chip_Upgrades: "Upgrades",
                chip_HardwareFix: "Hardware Fix",
                chip_SoftwareFix: "Software Fix",
                chip_Diagnostics: "Diagnostics",
                langAr: "ARABIC",
                langEn: "ENGLISH",
                langJa: "JAPANESE",
                langTr: "TURKISH",
                btnContactSubmit: "Submit",
                msgSuccess: "Message sent successfully!",
                msgError: "Failed to send message. Please try again.",
                clickToEnlarge: "CLICK IMAGES TO ENLARGE",
                navHome: "HOME",
                navAbout: "ABOUT",
                navProjects: "PROJECTS",
                navSkills: "SKILLS",
                navContact: "CONTACT",
                captchaRobot: "I'm not a robot",
                captchaQuestion: "Solve",
                captchaOk: "Verified",
                captchaWrong: "Incorrect answer, try again.",
                captchaRequired: "Please complete the verification.",
                levelNative: "Native",
                levelConversational: "Conversational",
                levelJlpt: "JLPT N2",
                levelC1: "Proficiency Exam C1",
                hlLanguages: "4 Languages",
                hlStack: "Unity + C#",
                hlLocation: "Tokyo, Japan",
                hlOpen: "Open to work"
            },
            ar: {
                name: "محمد الأشرف طليمات",
                tagline: "طالب برمجة ألعاب – أدمج بين الأكواد، الإبداع، وأساسيات اللعب",
                studentAt: "طالب في معهد تيكنوس كوليج، طوكيو",
                btnProjects: "تصفح المشاريع",
                btnCV: "تحميل السيرة الذاتية",
                btnDemo: "تجربة اللعبة على itch.io",
                btnGDD: "قراءة وثيقة التصميم",
                aboutTitle: "نبذة عني",
                aboutDesc: "طالب سوري مقيم في طوكيو ومطور ألعاب طموح. أدرس حالياً في تيكنوس كوليج وأركز على البرمجة باستخدام Unity و C#. أدمج بين التقنيات الحديثة وأدوات الذكاء الاصطناعي لبناء أنظمة ممتعة. مستعد للعمل حضوريًا أو عن بُعد.",
                aboutHobby: "بعيدًا عن الشاشة، أبني مجسمات بلاستيكية — وخصوصًا روبوتات ماكروس. عندما أبدأ في تجميع أحدها، تمرّ الساعات دون أن أشعر وأنسى ما حولي تمامًا.",
                projectsTitle: "أبرز الأعمال",
                p1Title: "سول فريم",
                p1Desc: "لعبة إطلاق نار فضائية بأسلوب Chicken Invaders.",
                p1DescLong: "لعبة إطلاق نار كلاسيكية. تم بناء الأنظمة الأساسية باستخدام أدوات مساعدة لتحسين الأكواد. تم التطوير على Unity.",
                p2Title: "مجسمات بيئية 3D",
                p2Desc: "تصاميم ثلاثية الأبعاد لمحطة القطار ومبنى المعهد.",
                p2DescLong: "إعادة بناء ثلاثية الأبعاد كاملة لمحطة موساشي-كوغاني ومعهد تيكنوس في مايا، مع النمذجة والإضاءة اعتمادًا على صور مرجعية.",
                p3Title: "فن البكسل والتصميم",
                p3Desc: "تصاميم شخصيات، واجهات، وخرائط مراحل باستخدام فوتوشوب.",
                p3DescLong: "مجموعة من أعمال التصميم باستخدام فوتوشوب، تشمل ملصقات توعوية، واجهات مستخدم، ورسومات بيكسل لشخصيات ألعاب كلاسيكية.",
                p4Title: "معرض طوكيو للألعاب 2024",
                p4Desc: "لقاء فريق Digital Extremes بعد 11 سنة من اللعب.",
                p4DescLong: "بعد 11 سنة من لعب Warframe ومشاهدة البثوث (Devstreams)، أخيراً قابلت الوجوه التي لطالما رأيتها خلف الشاشة. كان اللقاء أشبه بلم شمل عائلي مليء بالمشاعر بالنسبة لي، وحظيت بمحادثة ملهمة ودافئة مع فريق Digital Extremes.",
                p5Title: "أصداء دمشق",
                p5Desc: "عرض تقديمي (GDD) للعبة منصات ثنائية الأبعاد تدعم لغات متعددة.",
                p6Title: "لعبة البرجيس",
                p6Desc: "وثيقة تصميم متكاملة (GDD) لتحديث لعبة الطاولة التراثية البرجيس.",
                skillsTitle: "المهارات واللغات",
                skills_GameDev: "تطوير الألعاب",
                skills_Code: "البرمجة",
                skills_Design: "التصميم",
                skills_Audio: "الصوت",
                skills_PCBuild: "تجميع الحواسيب",
                skills_TechRepair: "إصلاح الأجهزة",
                chip_Gameplay: "أسلوب اللعب",
                chip_AITools: "أدوات الذكاء الاصطناعي",
                chip_UIUX: "واجهة/تجربة المستخدم",
                chip_SoundDesign: "تصميم الصوت",
                chip_Assembly: "التجميع",
                chip_Teardown: "التفكيك",
                chip_Upgrades: "الترقيات",
                chip_HardwareFix: "إصلاح العتاد",
                chip_SoftwareFix: "إصلاح البرمجيات",
                chip_Diagnostics: "التشخيص",
                langAr: "العربية",
                langEn: "الإنجليزية",
                langJa: "اليابانية",
                langTr: "التركية",
                btnContactSubmit: "إرسال",
                msgSuccess: "تم إرسال الرسالة بنجاح!",
                msgError: "فشل إرسال الرسالة. حاول مرة أخرى.",
                clickToEnlarge: "اضغط على الصورة للتكبير",
                navHome: "الرئيسية",
                navAbout: "نبذة",
                navProjects: "المشاريع",
                navSkills: "المهارات",
                navContact: "تواصل",
                captchaRobot: "أنا لست روبوتًا",
                captchaQuestion: "حل",
                captchaOk: "تم التحقق",
                captchaWrong: "إجابة خاطئة، حاول مرة أخرى.",
                captchaRequired: "يرجى إكمال عملية التحقق.",
                levelNative: "لغة أم",
                levelConversational: "محادثة",
                levelJlpt: "JLPT N2",
                levelC1: "اختبار كفاءة C1",
                hlLanguages: "4 لغات",
                hlStack: "Unity + C#",
                hlLocation: "طوكيو، اليابان",
                hlOpen: "متاح للعمل"
            },
            ja: {
                name: "エム アルアシュラフ トリマト",
                tagline: "ゲームプログラマーを目指して – コードと創造性、コアゲームプレイをつなぐ",
                studentAt: "総合学院テクノスカレッジ在学中 (東京)",
                btnProjects: "プロジェクトを見る",
                btnCV: "履歴書ダウンロード",
                btnDemo: "itch.ioでプレイ",
                btnGDD: "企画書を読む",
                aboutTitle: "自己紹介",
                aboutDesc: "東京を拠点とするシリア出身の学生。テクノスカレッジでUnityとC#を使ったゲームプログラミングを学んでいます。最新技術を活用して面白いゲームシステムを構築することに注力しています。",
                aboutHobby: "画面から離れているときは、プラモデル、とくにマクロスのメカを作っています。作り始めると時間があっという間に過ぎ、周りを忘れてしまうほど夢中になります。",
                projectsTitle: "注目のプロジェクト",
                p1Title: "ソル・フレーム",
                p1Desc: "Chicken Invaders風のスペースシューティングゲーム。",
                p1DescLong: "Chicken Invadersにインスパイアされたクラシックなアーケードシューティング。Unity製。",
                p2Title: "3D環境モデル",
                p2Desc: "駅とキャンパスを含む3D環境モデリング。",
                p2DescLong: "Mayaで制作した武蔵小金井駅とテクノスカレッジの3D再現。写真資料を基にモデリング、テクスチャ、ライティングを構築しました。",
                p3Title: "ピクセルアート＆デザイン",
                p3Desc: "Photoshopで作成したキャラクターやレベルデザイン。",
                p3DescLong: "Photoshopで作成したグラフィックデザイン。ポスター、UIモックアップ、8ビットキャラクターのドット絵などが含まれています。",
                p4Title: "東京ゲームショウ 2024",
                p4Desc: "11年越しにDigital Extremesチームとの対面。",
                p4DescLong: "Warframeをプレイし、Devstreamを見続けて11年。ついに画面の向こう側の開発陣とお会いすることができました。まるで家族との再会のような感動的な瞬間であり、Digital Extremesのチームと非常に刺激的で温かい会話を交わすことができました。",
                p5Title: "ダマスカスの残響",
                p5Desc: "多言語対応の叙情的な2Dプラットフォーマー企画書（GDD）。",
                p6Title: "バルジース (伝統的ボードゲーム)",
                p6Desc: "中東の伝統的なボードゲーム「バルジース」を現代化したゲームデザインドキュメント（GDD）。",
                skillsTitle: "スキルとツール",
                skills_GameDev: "ゲーム開発",
                skills_Code: "コード",
                skills_Design: "デザイン",
                skills_Audio: "オーディオ",
                skills_PCBuild: "PC組み立て",
                skills_TechRepair: "修理・整備",
                chip_Gameplay: "ゲームプレイ",
                chip_AITools: "AIツール",
                chip_UIUX: "UI/UX",
                chip_SoundDesign: "サウンドデザイン",
                chip_Assembly: "組み立て",
                chip_Teardown: "分解",
                chip_Upgrades: "アップグレード",
                chip_HardwareFix: "ハードウェア修理",
                chip_SoftwareFix: "ソフトウェア修理",
                chip_Diagnostics: "診断",
                langAr: "アラビア語",
                langEn: "英語",
                langJa: "日本語",
                langTr: "トルコ語",
                btnContactSubmit: "送信",
                msgSuccess: "メッセージが送信されました！",
                msgError: "送信に失敗しました。もう一度お試しください。",
                clickToEnlarge: "クリックして画像を拡大",
                navHome: "ホーム",
                navAbout: "自己紹介",
                navProjects: "プロジェクト",
                navSkills: "スキル",
                navContact: "お問い合わせ",
                captchaRobot: "私はロボットではありません",
                captchaQuestion: "計算",
                captchaOk: "確認済み",
                captchaWrong: "答えが違います。もう一度お試しください。",
                captchaRequired: "認証を完了してください。",
                levelNative: "ネイティブ",
                levelConversational: "日常会話",
                levelJlpt: "日本語能力試験 N2",
                levelC1: "語学検定 C1",
                hlLanguages: "4言語",
                hlStack: "Unity + C#",
                hlLocation: "東京",
                hlOpen: "仕事募集中"
            },
            ko: {
                name: "엠 알아슈라프 토리마트",
                tagline: "미래의 게임 프로그래머 – 코드, 창의성, 핵심 게임 플레이의 조화",
                studentAt: "테크노스 대학 재학 중 (도쿄)",
                btnProjects: "프로젝트 보기",
                btnCV: "이력서 다운로드",
                btnDemo: "itch.io에서 플레이",
                btnGDD: "기획서 보기",
                aboutTitle: "자기소개",
                aboutDesc: "도쿄에 거주하는 시리아 출신 학생입니다. 현재 테크노스 대학에서 Unity와 C#을 중심으로 게임 프로그래밍을 배우고 있습니다.",
                aboutHobby: "화면 밖에서는 프라모델, 특히 마크로스 메카를 만듭니다. 하나를 만들기 시작하면 시간이 순식간에 지나가고 주변을 완전히 잊어버립니다.",
                projectsTitle: "주요 프로젝트",
                p1Title: "솔 프레임",
                p1Desc: "Chicken Invaders 스타일의 우주 슈팅 게임.",
                p1DescLong: "Unity로 제작된 클래식 아케이드 슈팅 게임.",
                p2Title: "3D 환경 모델링",
                p2Desc: "역 및 캠퍼스 3D 환경 모델링.",
                p2DescLong: "Maya로 제작한 무사시코가네이역과 테크노스 대학의 3D 재현. 사진 자료를 바탕으로 모델링, 텍스처, 라이팅을 작업했습니다.",
                p3Title: "픽셀 아트 및 디자인",
                p3Desc: "Photoshop으로 제작한 캐릭터 및 레벨 디자인.",
                p3DescLong: "Photoshop을 사용한 그래픽 디자인 모음. 포스터, UI 디자인 및 8비트 캐릭터 픽셀 아트가 포함되어 있습니다.",
                p4Title: "도쿄 게임쇼 2024",
                p4Desc: "11년 만에 Digital Extremes 팀을 만나다.",
                p4DescLong: "11년 동안 Warframe을 플레이하고 Devstream을 시청한 끝에 드디어 화면 너머의 개발진을 만났습니다. 마치 가족 상봉처럼 감동적이었고, Digital Extremes 팀과 정말 영감을 주는 따뜻한 대화를 나누었습니다.",
                p5Title: "다마스쿠스의 잔향",
                p5Desc: "다국어를 지원하는 서정적인 2D 플랫포머 기획서(GDD).",
                p6Title: "바르지스 (전통 보드게임)",
                p6Desc: "전통 보드게임 바르지스를 현대화한 종합적인 게임 기획서(GDD).",
                skillsTitle: "기술 및 언어",
                skills_GameDev: "게임 개발",
                skills_Code: "코드",
                skills_Design: "디자인",
                skills_Audio: "오디오",
                skills_PCBuild: "PC 조립",
                skills_TechRepair: "기술 수리",
                chip_Gameplay: "게임플레이",
                chip_AITools: "AI 도구",
                chip_UIUX: "UI/UX",
                chip_SoundDesign: "사운드 디자인",
                chip_Assembly: "조립",
                chip_Teardown: "분해",
                chip_Upgrades: "업그레이드",
                chip_HardwareFix: "하드웨어 수리",
                chip_SoftwareFix: "소프트웨어 수리",
                chip_Diagnostics: "진단",
                langAr: "아랍어",
                langEn: "영어",
                langJa: "일본어",
                langTr: "튀르키예어",
                btnContactSubmit: "제출",
                msgSuccess: "메시지가 성공적으로 전송되었습니다!",
                msgError: "전송에 실패했습니다. 다시 시도해 주세요.",
                clickToEnlarge: "클릭하여 이미지 확대",
                navHome: "홈",
                navAbout: "소개",
                navProjects: "프로젝트",
                navSkills: "기술",
                navContact: "연락처",
                captchaRobot: "저는 로봇이 아닙니다",
                captchaQuestion: "계산",
                captchaOk: "확인됨",
                captchaWrong: "답이 틀렸습니다. 다시 시도하세요.",
                captchaRequired: "인증을 완료해 주세요.",
                levelNative: "원어민",
                levelConversational: "일상 회화",
                levelJlpt: "JLPT N2",
                levelC1: "어학 시험 C1",
                hlLanguages: "4개 언어",
                hlStack: "Unity + C#",
                hlLocation: "도쿄",
                hlOpen: "채용 가능"
            },
            tr: {
                name: "M ALASHRAF TOLIMAT",
                tagline: "YETİŞMEKTE OLAN OYUN PROGRAMCISI – KODU, YARATICILIĞI VE TEMEL OYNANIŞI BİRLEŞTİRİYOR",
                studentAt: "TECHNOS COLLEGE, Tokyo öğrencisi",
                btnProjects: "PROJELERİ GÖR",
                btnCV: "CV İNDİR",
                btnDemo: "itch.io'da Demoyu Oyna",
                btnGDD: "Tam GDD'yi Oku",
                aboutTitle: "HAKKIMDA",
                aboutDesc: "Tokyo'da yaşayan Suriyeli bir öğrenci ve hevesli bir oyun geliştiricisiyim. Şu anda Technos College'da Unity ve C# ile oyun programlama üzerine eğitim alıyorum. İlgi çekici oynanış sistemleri kurmak için modern teknolojileri ve yapay zekâ araçlarını birleştiriyorum. Hem ofiste hem de uzaktan çalışmaya hazırım.",
                aboutHobby: "Ekrandan uzakta plastik maketler — özellikle Macross mecha — yapıyorum. Birine başladığımda saatler kaybolur ve çevremi tamamen unuturum.",
                projectsTitle: "ÖNE ÇIKAN ÇALIŞMALAR",
                p1Title: "Sol Frame",
                p1Desc: "Chicken Invaders tarzı uzay nişancı oyunu.",
                p1DescLong: "Chicken Invaders tarzı oynanıştan esinlenen klasik arcade uzay nişancısı. Unity ile geliştirildi.",
                p2Title: "3D Ortamlar",
                p2Desc: "İstasyon ve kampüs dahil 3D ortam modelleri.",
                p2DescLong: "Maya'da Musashi-Koganei İstasyonu ve Technos College kampüsünün tam 3D yeniden yapımı. Modelleme, doku ve aydınlatma fotoğraf referansından oluşturuldu.",
                p3Title: "Piksel Sanatı ve Tasarım",
                p3Desc: "Photoshop'ta oluşturulan karakter, arayüz ve seviye tasarımı konseptleri.",
                p3DescLong: "Photoshop'ta oluşturulan grafik tasarım çalışmaları; arayüz/UX maketleri, eğitici posterler ve okunaklı siluetlere odaklanan 8-bit karakter sprite'ları içerir.",
                p4Title: "Tokyo Oyun Fuarı 2024",
                p4Desc: "11 yıl sonra Digital Extremes ekibiyle tanışmak.",
                p4DescLong: "11 yıl boyunca Warframe oynayıp Devstream'leri izledikten sonra nihayet ekranın arkasındaki yüzlerle tanıştım. İçten bir aile buluşması gibiydi ve Digital Extremes ekibiyle son derece ilham verici, sıcak bir sohbet ettim.",
                p5Title: "Şam'ın Yankıları",
                p5Desc: "Çok dilli destek sunan lirik bir 2D platform oyunu GDD ve teklifi.",
                p6Title: "Barjees Kutu Oyunu",
                p6Desc: "Geleneksel kutu oyununu modernleştiren eksiksiz bir Oyun Tasarım Belgesi.",
                skillsTitle: "YETENEKLER VE DİLLER",
                skills_GameDev: "Oyun Geliştirme",
                skills_Code: "Kod",
                skills_Design: "Tasarım",
                skills_Audio: "Ses",
                skills_PCBuild: "PC Toplama",
                skills_TechRepair: "Teknik Onarım",
                chip_Gameplay: "Oynanış",
                chip_AITools: "YZ Araçları",
                chip_UIUX: "Arayüz/UX",
                chip_SoundDesign: "Ses Tasarımı",
                chip_Assembly: "Montaj",
                chip_Teardown: "Söküm",
                chip_Upgrades: "Yükseltme",
                chip_HardwareFix: "Donanım Onarımı",
                chip_SoftwareFix: "Yazılım Onarımı",
                chip_Diagnostics: "Teşhis",
                langAr: "ARAPÇA",
                langEn: "İNGİLİZCE",
                langJa: "JAPONCA",
                langTr: "TÜRKÇE",
                btnContactSubmit: "Gönder",
                msgSuccess: "Mesaj başarıyla gönderildi!",
                msgError: "Mesaj gönderilemedi. Lütfen tekrar deneyin.",
                clickToEnlarge: "BÜYÜTMEK İÇİN GÖRSELE TIKLAYIN",
                navHome: "ANA SAYFA",
                navAbout: "HAKKIMDA",
                navProjects: "PROJELER",
                navSkills: "YETENEKLER",
                navContact: "İLETİŞİM",
                captchaRobot: "Ben robot değilim",
                captchaQuestion: "Çöz",
                captchaOk: "Doğrulandı",
                captchaWrong: "Yanlış cevap, tekrar deneyin.",
                captchaRequired: "Lütfen doğrulamayı tamamlayın.",
                levelNative: "Ana dil",
                levelConversational: "Konuşma",
                levelJlpt: "JLPT N2",
                levelC1: "Yeterlilik Sınavı C1",
                hlLanguages: "4 Dil",
                hlStack: "Unity + C#",
                hlLocation: "Tokyo, Japonya",
                hlOpen: "İşe açık"
            }
        };

        const cvFiles = {
            en: 'Resume_English.pdf',
            ar: 'Resume_Arabic.pdf',
            ja: 'Resume_Japanese.pdf',
            ko: 'Resume_Korean.pdf',
            tr: 'Resume_Turkish.pdf'
        };

        function setLang(lang) {
            const applyKey = (lang === 'tt') ? 'en' : lang;

            document.querySelectorAll('[data-i18n]').forEach(el => {
                const key = el.getAttribute('data-i18n');
                if (translations[applyKey] && translations[applyKey][key]) {
                    el.innerText = translations[applyKey][key];
                    el.setAttribute('dir', applyKey === 'ar' ? 'rtl' : 'ltr');
                }
            });
            
            const dynName = document.getElementById('dynamicName');
            dynName.innerText = translations[applyKey].name;
            dynName.setAttribute('dir', applyKey === 'ar' ? 'rtl' : 'ltr');
            
            document.documentElement.setAttribute('lang', applyKey);
            
            const buttons = document.querySelectorAll('.lang-btn');
            buttons.forEach(btn => {
                btn.classList.remove('text-white');
                btn.classList.add('text-gray-400');
            });
            const activeBtn = document.querySelector(`.lang-btn[data-lang="${lang}"]`);
            if (activeBtn) {
                activeBtn.classList.add('text-white');
                activeBtn.classList.remove('text-gray-400');
            }

            // Update the language dropdown trigger
            const langMeta = {
                ar: { flag: 'https://flagcdn.com/24x18/sa.png', short: 'AR' },
                en: { flag: 'https://flagcdn.com/24x18/gb.png', short: 'EN' },
                ja: { flag: 'https://flagcdn.com/24x18/jp.png', short: 'JP' },
                ko: { flag: 'https://flagcdn.com/24x18/kr.png', short: 'KO' },
                tr: { flag: 'https://flagcdn.com/24x18/tr.png', short: 'TR' },
                tt: { flag: 'tenno-flag.png', short: 'TT' }
            };
            const meta = langMeta[lang];
            if (meta) {
                const curFlag = document.getElementById('lang-current-flag');
                const curLabel = document.getElementById('lang-current-label');
                if (curFlag) curFlag.src = meta.flag;
                if (curLabel) curLabel.textContent = meta.short;
            }

            const cvLink = document.getElementById('cv-link');
            if (cvLink && cvFiles[applyKey]) {
                cvLink.href = cvFiles[applyKey];

                // If a CV is currently open in the embedded viewer, switch it live too
                const frame = document.getElementById('viewer-frame');
                const src = frame ? (frame.getAttribute('src') || '') : '';
                if (/^Resume_[^/]*\.pdf$/i.test(src)) {
                    frame.setAttribute('src', cvFiles[applyKey]);
                }
            }

            // Share the selected language with every GDD so they open in the same language
            try {
                const syncLang = (lang === 'tt') ? 'tt' : applyKey;
                localStorage.setItem('echos-lang', syncLang);      // Echoes of Damascus
                localStorage.setItem('solgdd.lang', syncLang);     // Sol Frame
                localStorage.setItem('barjees_lang', syncLang === 'ja' ? 'jp' : syncLang);    // Barjees (uses 'jp' for Japanese)
            } catch (e) {}

            // Tenno script mode: render the (English) content with the tenObet font
            document.body.classList.toggle('tenno-active', lang === 'tt');
        }

        // Bidirectional sync: if a GDD (or another tab) changes its stored
        // language, update the portfolio header to match.
        window.addEventListener('storage', (e) => {
            const resolve = {
                'echos-lang': (v) => v,
                'solgdd.lang': (v) => v,
                'barjees_lang': (v) => (v === 'jp' ? 'ja' : v)
            }[e.key];
            if (!resolve || !e.newValue) return;
            const lang = resolve(e.newValue);
            if (['en', 'ar', 'ja', 'ko', 'tr', 'tt'].indexOf(lang) === -1) return;
            if (lang !== document.documentElement.getAttribute('lang')) setLang(lang);
        });

        // Modals Logic
        function openModal(id) {
            const m = document.getElementById(id);
            if (!m) return;
            m.classList.add('active');
            document.body.style.overflow = 'hidden';
            m.querySelectorAll('img[data-src]').forEach(img => {
                if (img.dataset.src && !img.dataset.loaded) {
                    img.src = img.dataset.src;
                    img.dataset.loaded = '1';
                }
            });
            m.querySelectorAll('video').forEach(v => {
                v.preload = 'auto';
                v.play().catch(() => {});
            });
        }
        function closeModal(id) {
            const m = document.getElementById(id);
            if (!m) return;
            m.classList.remove('active');
            document.body.style.overflow = '';
            m.querySelectorAll('video').forEach(v => v.pause());
        }
        function closeAllModals() {
            document.querySelectorAll('.modal.active').forEach(m => closeModal(m.id));
            closeLightbox();
        }

        // Embedded viewer (keeps the header visible above GDDs / CVs)
        let viewerRevealTimer = null;
        function openViewer(url, title) {
            const viewer = document.getElementById('viewer');
            const frame = document.getElementById('viewer-frame');
            if (!viewer || !frame || !url) return;
            syncViewerTop();
            viewer.classList.remove('content-ready');
            if (frame.getAttribute('src') !== url) frame.setAttribute('src', url);
            // animate the panel in on the next frame, then reveal content once it has settled
            requestAnimationFrame(() => viewer.classList.add('viewer-open'));
            clearTimeout(viewerRevealTimer);
            viewerRevealTimer = setTimeout(() => viewer.classList.add('content-ready'), 270);
            document.body.style.overflow = 'hidden';
        }
        function closeViewer() {
            const viewer = document.getElementById('viewer');
            const frame = document.getElementById('viewer-frame');
            if (!viewer) return;
            viewer.classList.remove('viewer-open');
            viewer.classList.remove('content-ready');
            clearTimeout(viewerRevealTimer);
            document.body.style.overflow = '';
            setTimeout(function () {
                if (!viewer.classList.contains('viewer-open') && frame) frame.src = 'about:blank';
            }, 420);
        }
        function syncViewerTop() {
            const nav = document.querySelector('nav');
            const viewer = document.getElementById('viewer');
            if (nav && viewer) viewer.style.top = nav.offsetHeight + 'px';
        }
        window.addEventListener('resize', syncViewerTop);
        window.addEventListener('load', syncViewerTop);
        syncViewerTop();

        // Route marked links into the embedded viewer instead of leaving the page
        document.addEventListener('click', function (e) {
            const link = e.target.closest('[data-viewer]');
            if (!link) return;
            e.preventDefault();
            closeAllModals();
            openViewer(link.getAttribute('href'), link.getAttribute('data-viewer'));
        });

        // Lightbox Gallery Logic
        function openLightbox(imgSrc) {
            const lb = document.getElementById('lightbox');
            const lbImg = document.getElementById('lightbox-img');
            lbImg.src = imgSrc;
            lb.classList.remove('hidden');
        }
        function closeLightbox() {
            const lb = document.getElementById('lightbox');
            lb.classList.add('hidden');
            setTimeout(() => { document.getElementById('lightbox-img').src = ''; }, 300);
        }

        window.onclick = function (event) {
            if (event.target.classList.contains('modal')) {
                closeModal(event.target.id);
            }
        };
        
        document.addEventListener('keydown', e => { 
            if (e.key === 'Escape') { closeAllModals(); closeViewer(); }
        });

        // Language dropdown open/close
        (function () {
            const toggle = document.getElementById('lang-toggle');
            const menu = document.getElementById('lang-menu');
            if (!toggle || !menu) return;
            function closeMenu() {
                menu.classList.add('hidden');
                toggle.setAttribute('aria-expanded', 'false');
            }
            toggle.addEventListener('click', function (e) {
                e.stopPropagation();
                const isHidden = menu.classList.toggle('hidden');
                toggle.setAttribute('aria-expanded', String(!isHidden));
            });
            menu.querySelectorAll('button').forEach(function (b) {
                b.addEventListener('click', closeMenu);
            });
            document.addEventListener('click', function (e) {
                if (!menu.classList.contains('hidden') && !menu.contains(e.target) && !toggle.contains(e.target)) {
                    closeMenu();
                }
            });
            document.addEventListener('keydown', function (e) {
                if (e.key === 'Escape') closeMenu();
            });
        })();

        // Highlight the nav link for the section currently in view
        (function () {
            const links = Array.from(document.querySelectorAll('[data-nav]'));
            const pairs = links
                .map(function (l) { return { link: l, section: document.querySelector(l.getAttribute('href')) }; })
                .filter(function (p) { return p.section; });
            if (!pairs.length) return;

            function setActive(link) {
                links.forEach(function (l) { l.classList.toggle('active', l === link); });
            }

            function onScroll() {
                // at the very bottom, always light up the last section (footer/contact)
                const bottomReached = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
                if (bottomReached) {
                    setActive(pairs[pairs.length - 1].link);
                    return;
                }
                const line = window.innerHeight * 0.35;
                let current = pairs[0];
                for (let i = 0; i < pairs.length; i++) {
                    if (pairs[i].section.getBoundingClientRect().top <= line) current = pairs[i];
                }
                setActive(current.link);
            }

            window.addEventListener('scroll', onScroll, { passive: true });
            window.addEventListener('resize', onScroll);
            onScroll();
        })();

        // If a section is opened from the header while the viewer is showing,
        // close the viewer so the smooth scroll actually lands on the section.
        document.querySelectorAll('[data-nav]').forEach(function (link) {
            link.addEventListener('click', function () { closeViewer(); });
        });

        // CAPTCHA is handled by Cloudflare Turnstile (see the .cf-turnstile widget in the
        // contact form). Formspree verifies the cf-turnstile-response token server-side when
        // the Turnstile secret is configured for the form in the Formspree dashboard.
        (function () {
            const form = document.getElementById('contact-form');
            if (!form) return;
            const resetWidget = function () {
                try { if (window.turnstile && turnstile.reset) turnstile.reset(); } catch (e) {}
            };
            // Turnstile tokens are single-use: refresh the widget on manual reset...
            form.addEventListener('reset', resetWidget);
            // ...and after a successful submit, so the next message can be sent.
            const ok = form.querySelector('[data-fs-success]');
            if (ok && window.MutationObserver) {
                new MutationObserver(function () {
                    if (ok.style.display !== 'none') resetWidget();
                }).observe(ok, { attributes: true, attributeFilter: ['style', 'class'] });
            }
        })();

        // Initialize language on load so static HTML matches the active language
        setLang('en');
    