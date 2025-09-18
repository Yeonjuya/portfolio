const container = document.getElementById('skills');
if (!container) {
    console.error('#skills 요소 없음');
} else {

    const { Engine, World, Bodies, Body, Render, MouseConstraint, Mouse, Runner } = Matter;

    function getResponsiveScale(cw) {
        if (cw <= 360) return { sprite: 0.40, hit: 0.3, small: 0.10 };
        if (cw <= 468) return { sprite: 0.50, hit: 0.35, small: 0.10 };
        if (cw <= 800) return { sprite: 0.70, hit: 0.55, small: 0.40 };
        if (cw <= 1200) return { sprite: 0.75, hit: 0.6, small: 0.45 };
        return { sprite: 0.85, hit: 0.60, small: 0.45 };
    }

    //  엔진 및 렌더러 생성 
    const engine = Engine.create();
    const renderer = Render.create({
        element: container,
        engine: engine,
        options: {
            width: container.offsetWidth,
            height: container.offsetHeight,
            wireframes: false,
            background: '#ffffff'
        }
    });

    //  마우스 컨트롤 생성
    const mouse = Mouse.create(renderer.canvas);
    const mouseConstraint = MouseConstraint.create(engine, {
        mouse: mouse,
        constraint: { stiffness: 0.2, render: { visible: false } }
    });

    // 스크롤/터치 방해 방지
    mouse.element.removeEventListener("mousewheel", mouse.mousewheel);
    mouse.element.removeEventListener("DOMMouseScroll", mouse.mousewheel);
    mouse.element.removeEventListener("touchstart", mouse.mousedown);
    mouse.element.removeEventListener("touchmove", mouse.mousemove);
    mouse.element.removeEventListener("touchend", mouse.mouseup);

    // 데이터와 로직 분리
    const elementData = [
        { src: 'images/skill_obj01.svg', isSmall: false, angle: 6 },
        { src: 'images/skill_obj02.svg', isSmall: false, angle: -10 },
        { src: 'images/skill_obj03.svg', isSmall: false, angle: 4 },
        { src: 'images/skill_obj04.svg', isSmall: false, angle: -8 },
        { src: 'images/skill_obj05.svg', isSmall: false, angle: 12 },
        { src: 'images/skill_obj06.svg', isSmall: false, angle: -6 },
        { src: 'images/skill_obj07.svg', isSmall: false, angle: -5 },
        { src: 'images/skill_obj08.svg', isSmall: false, angle: 9 },
        { src: 'images/skill_obj09.svg', isSmall: false, angle: -7 },
        { src: 'images/skill_obj10.svg', isSmall: false, angle: 5 },
        { src: 'images/skill_obj11.svg', isSmall: false, angle: -12 },
        { src: 'images/skill_obj12.svg', isSmall: false, angle: 8 },
        { src: 'images/skill_obj13.svg', isSmall: false, angle: 7 },
        { src: 'images/skill_obj14.svg', isSmall: false, angle: -9 },
        {
            src: 'images/skill_obj15.svg',
            isSmall: false,
            angle: 3,
            link: './pdfs/JeongYeonju_Resume.pdf'
        },
        { src: 'images/skill_obj16.svg', isSmall: true, angle: -11 },
        { src: 'images/skill_obj17.svg', isSmall: true, angle: 6 },
        { src: 'images/skill_obj18.svg', isSmall: true, angle: 6 },
    ];

    const ITEM_W = 520, ITEM_H = 140;
    const physics = { restitution: 0.3, friction: 0.3, frictionStatic: 0.8 };
    const deg = d => d * Math.PI / 180;

    let createdElements = [];

    //  이미지 요소 생성 함수
    function createImgRect(src, w, h, spriteScale, hitScale, x, y, angleDeg, link = null) {
        const body = Bodies.rectangle(x, y, w * hitScale, h * hitScale, {
            ...physics,
            render: {
                sprite: { texture: src, xScale: spriteScale, yScale: spriteScale }
            }
        });
        Body.setAngle(body, deg(angleDeg || 0));

        if (link) {
            body.clickLink = link;
        }

        return body;
    }

    // 클릭 이벤트 처리 함수
    function handleClick(event) {
        const mousePosition = mouse.position;

        for (let element of createdElements) {
            if (element.clickLink) {
                const bounds = element.bounds;
                if (mousePosition.x >= bounds.min.x && mousePosition.x <= bounds.max.x &&
                    mousePosition.y >= bounds.min.y && mousePosition.y <= bounds.max.y) {

                    const downloadUrl = element.clickLink.replace('/view?usp=sharing', '/export?format=pdf&id=1S-Mk0N_FRbjABeL88c-7xO99ZxmoRN5v');
                    window.open(downloadUrl, '_blank');
                    break;
                }
            }
        }
    }

    // 캔버스에 클릭 이벤트 추가
    renderer.canvas.addEventListener('click', handleClick);

    //  시뮬레이션을 리셋하고 새로 시작하는 핵심 함수
    function resetSimulation() {
        const CW = container.offsetWidth;
        const CH = container.offsetHeight;

        World.clear(engine.world);

        renderer.canvas.width = CW;
        renderer.canvas.height = CH;
        renderer.options.width = CW;
        renderer.options.height = CH;

        //벽 생성
        const walls = [
            Bodies.rectangle(-0.5, CH / 2, 1, CH * 2, { isStatic: true, render: { opacity: 0 } }),
            Bodies.rectangle(CW + 0.5, CH / 2, 1, CH * 2, { isStatic: true, render: { opacity: 0 } }),
            Bodies.rectangle(CW / 2, CH + 0.5, CW * 2, 1, { isStatic: true, render: { opacity: 0 } })
        ];
        World.add(engine.world, walls);

        const { sprite: SPRITE, hit: HIT, small: SMALL_HIT } = getResponsiveScale(CW);

        // 요소 생성
        const elements = elementData.map((data, index) => {
            const x = Math.random() * (CW * 0.8) + (CW * 0.1);
            const y = -200 - (index * 150);
            const hitScale = data.isSmall ? SMALL_HIT : HIT;

            return createImgRect(data.src, ITEM_W, ITEM_H, SPRITE, hitScale, x, y, data.angle, data.link);
        });

        createdElements = elements;

        World.add(engine.world, [...elements, mouseConstraint]);
    }


    let resizeId;
    function handleResize() {
        clearTimeout(resizeId);
        resizeId = setTimeout(resetSimulation, 150);
    }

    window.addEventListener('resize', handleResize);
    new ResizeObserver(handleResize).observe(container);

    // 최초 실행
    resetSimulation();
    const runner = Runner.create();
    Runner.run(runner, engine);
    Render.run(renderer);
}