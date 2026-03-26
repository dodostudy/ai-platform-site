/**
 * main.js
 * 안전관리실 AI 플랫폼 메인 JavaScript
 * - 기존 my-profile-site_r1 패턴 재사용
 */

// ============================================================
// 네비게이션 관리
// ============================================================

function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    let currentSection = '';

    sections.forEach((section) => {
        if (window.scrollY >= section.offsetTop - 200) {
            currentSection = section.getAttribute('id');
        }
    });

    navLinks.forEach((link) => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('active');
        }
    });
}

function toggleMobileMenu() {
    document.getElementById('mobileMenu').classList.toggle('hidden');
}

function closeMobileMenu() {
    document.getElementById('mobileMenu').classList.add('hidden');
}

// ============================================================
// 스무스 스크롤
// ============================================================

function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetElement = document.querySelector(this.getAttribute('href'));
            if (targetElement) {
                closeMobileMenu();
                targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
}

// ============================================================
// Intersection Observer - 섹션 페이드인
// ============================================================

function setupIntersectionObserver() {
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.style.animation = 'fadeInUp 0.8s ease-out forwards';
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.1 }
    );

    document.querySelectorAll('section').forEach((section) => {
        section.style.opacity = '0';
        observer.observe(section);
    });
}

// ============================================================
// 헤더 스크롤 시 배경 강화
// ============================================================

function setupNavScrollEffect() {
    const nav = document.querySelector('nav');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            nav.classList.add('shadow-lg');
        } else {
            nav.classList.remove('shadow-lg');
        }
    });
}

// ============================================================
// Debounce
// ============================================================

function debounce(func, delay) {
    let timeoutId;
    return function (...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
}

// ============================================================
// 초기화
// ============================================================

document.addEventListener('DOMContentLoaded', function () {
    // 모바일 메뉴 토글
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', toggleMobileMenu);
    }

    // 모바일 메뉴 링크 클릭 시 닫기
    document.querySelectorAll('#mobileMenu a').forEach((link) => {
        link.addEventListener('click', closeMobileMenu);
    });

    // 스무스 스크롤
    setupSmoothScroll();

    // Intersection Observer 애니메이션
    setupIntersectionObserver();

    // 네비 스크롤 효과
    setupNavScrollEffect();
});

// 스크롤 이벤트 - 활성 네비 업데이트
window.addEventListener('scroll', () => {
    updateActiveNavLink();
});
updateActiveNavLink();

// 리사이즈 디바운스
window.addEventListener('resize', debounce(() => {
    updateActiveNavLink();
}, 250));
