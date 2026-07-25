// scripts.js - Main portfolio functionality

// Data Store
let portfolioData = {
    profile: {
        name: "Dr. Sarah Chen",
        title: "Senior Research Scientist in Computational Biology",
        email: "sarah.chen@broadinstitute.org",
        scholar: "https://scholar.google.com/citations?user=example",
        bio: "Leading interdisciplinary research at the intersection of artificial intelligence and molecular biology. Focused on developing computational methods to understand complex biological systems and disease mechanisms.",
        keywords: ["Machine Learning", "Bioinformatics", "Genomics", "Systems Biology"],
        photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
        metrics: {
            citations: 2847,
            hIndex: 28,
            i10Index: 42,
            publications: 56
        }
    },
    socialLinks: {
        twitter: "https://twitter.com/",
        linkedin: "https://www.linkedin.com/",
        github: "https://github.com/",
        scholar: "https://scholar.google.com/",
        orcid: "https://orcid.org/",
        website: "https://example.com/"
    },
    contact: {
        email: "sarah.chen@broadinstitute.org",
        scholar: "https://scholar.google.com/citations?user=example",
        message: "Interested in collaboration or have questions about my research? Feel free to reach out.",
        buttonTextEmail: "Send Email",
        buttonTextScholar: "Google Scholar"
    },
    mentors: [
        {
            id: 1,
            name: "Prof. Michael Zhang",
            institution: "Stanford University",
            role: "PhD Advisor",
            photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop"
        },
        {
            id: 2,
            name: "Dr. Lisa Wang",
            institution: "Broad Institute",
            role: "Collaborator",
            photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop"
        },
        {
            id: 3,
            name: "Prof. James Chen",
            institution: "MIT",
            role: "Committee Member",
            photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop"
        }
    ],
    experience: [
        {
            id: 1,
            title: "Senior Research Scientist",
            organization: "Broad Institute of MIT and Harvard",
            period: "2020 - Present",
            description: "Leading computational biology research group focusing on single-cell genomics and machine learning applications in cancer biology."
        },
        {
            id: 2,
            title: "Postdoctoral Researcher",
            organization: "Stanford University School of Medicine",
            period: "2017 - 2020",
            description: "Developed novel algorithms for analyzing high-dimensional biological data and integrative genomics approaches."
        },
        {
            id: 3,
            title: "Research Assistant",
            organization: "University of California, Berkeley",
            period: "2015 - 2017",
            description: "Worked on computational methods for phylogenetic analysis and evolutionary genomics."
        }
    ],
    academic: [
        {
            id: 1,
            degree: "Ph.D. in Computational Biology",
            institution: "University of California, Berkeley",
            period: "2012 - 2017",
            description: "Dissertation: \"Machine Learning Approaches for Understanding Gene Regulatory Networks\""
        },
        {
            id: 2,
            degree: "M.S. in Computer Science",
            institution: "Carnegie Mellon University",
            period: "2010 - 2012",
            description: "Specialization in Machine Learning and Data Mining"
        },
        {
            id: 3,
            degree: "B.S. in Biology & Computer Science",
            institution: "Massachusetts Institute of Technology",
            period: "2006 - 2010",
            description: "Double major with minor in Mathematics"
        }
    ],
    research: [
        {
            id: 1,
            title: "Single-Cell Atlas of Cancer",
            status: "ongoing",
            description: "Building a comprehensive single-cell reference atlas of tumor microenvironments across cancer types.",
            tags: ["scRNA-seq", "Spatial"],
            icon: "dna"
        },
        {
            id: 2,
            title: "Deep Learning for Drug Discovery",
            status: "ongoing",
            description: "Developing graph neural networks for molecular property prediction and drug-target interaction.",
            tags: ["GNN", "Drug Discovery"],
            icon: "brain"
        },
        {
            id: 3,
            title: "Gene Regulatory Networks",
            status: "published",
            description: "Inference of regulatory relationships from multi-omics data using causal discovery methods.",
            tags: ["Networks", "Causal"],
            icon: "project-diagram"
        }
    ],
    publications: [
        {
            id: 1,
            title: "Comprehensive integration of single-cell data",
            authors: "Chen S., et al.",
            journal: "Nature Biotechnology",
            year: 2023,
            category: "article",
            citations: 342,
            doi: "10.1038/s41587-023-01664-4",
            description: "A framework for integrating diverse single-cell datasets to enable comparative analysis across experiments and conditions."
        },
        {
            id: 2,
            title: "Spatial transcriptomics reveals tissue architecture",
            authors: "Chen S., Johnson R., et al.",
            journal: "Cell",
            year: 2022,
            category: "article",
            citations: 189,
            doi: "10.1016/j.cell.2022.05.012",
            description: "High-resolution spatial mapping of gene expression in complex tissues using advanced sequencing technologies."
        }
    ],
    events: [
        {
            id: 1,
            title: "Keynote: AI in Precision Medicine",
            type: "invited_talk",
            date: "2024-03-15",
            location: "International Conference on Computational Biology, Boston, MA",
            description: "Presented recent advances in machine learning applications for personalized cancer treatment."
        },
        {
            id: 2,
            title: "RECOMB 2023",
            type: "conference",
            date: "2023-12-10",
            location: "Istanbul, Turkey",
            description: "Presented poster on \"Scalable algorithms for single-cell multi-omics integration\"."
        }
    ],
    gallery: [
        {
            id: 1,
            title: "Laboratory Analysis",
            description: "Single-cell sequencing preparation",
            image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=600&h=400&fit=crop"
        },
        {
            id: 2,
            title: "Data Visualization",
            description: "UMAP projection of cell types",
            image: "https://images.unsplash.com/photo-1576086213369-97a306d36557?w=600&h=400&fit=crop"
        },
        {
            id: 3,
            title: "Conference Presentation",
            description: "RECOMB 2023 in Istanbul",
            image: "https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?w=600&h=400&fit=crop"
        }
    ],
    links: [
        {
            id: 1,
            title: "Lab Handbook",
            description: "Protocols and guidelines",
            category: "document",
            url: "#"
        },
        {
            id: 2,
            title: "GitHub Repository",
            description: "Open source tools",
            category: "repository",
            url: "#"
        },
        {
            id: 3,
            title: "Videos",
            description: "Published data",
            category: "Videos",
            url: "#"
        }
    ],
    settings: {
        siteTitle: "Academic Research Portfolio",
        footerText: "Research Portfolio",
        darkModeDefault: false,
        showMetrics: true,
        themeColors: {
            lightBackground: "#f8fafc",
            lightText: "#1f2937",
            lightGradientFrom: "#1e40af",
            lightGradientTo: "#7c3aed",
            lightGradientMid: "#c026d3",
            lightSurface: "#ffffff",
            lightSurfaceStrong: "#f3f4f6",
            darkBackground: "#0f172a",
            darkText: "#f8fafc",
            darkGradientFrom: "#60a5fa",
            darkGradientTo: "#a78bfa",
            darkGradientMid: "#f0abfc",
            darkSurface: "#111827",
            darkSurfaceStrong: "#1f2937"
        }
    }
};

// Initialize Application
document.addEventListener('DOMContentLoaded', function() {
    loadData().then(() => {
        initializeTheme();
        renderAll();
        setupEventListeners();
    });
});

function mergePortfolioData(defaults, incoming) {
    const merged = JSON.parse(JSON.stringify(defaults));

    const merge = (target, source) => {
        Object.keys(source || {}).forEach(key => {
            const sourceValue = source[key];
            const targetValue = target[key];

            if (Array.isArray(sourceValue)) {
                target[key] = sourceValue;
            } else if (sourceValue && typeof sourceValue === 'object' && !Array.isArray(sourceValue) && targetValue && typeof targetValue === 'object') {
                merge(targetValue, sourceValue);
            } else {
                target[key] = sourceValue;
            }
        });
    };

    merge(merged, incoming || {});
    return merged;
}

// Data Loading
async function loadData() {
    // For GitHub Pages / static hosting: prefer data.json as source of truth.
    // localStorage is only used as a temporary override in the admin panel.
    const isAdminContext = window.location.pathname.includes('admin');

    try {
        let serverData = null;
        try {
            const apiRes = await fetch('/api/data');
            if (apiRes.ok) serverData = await apiRes.json();
        } catch (_) { /* static host */ }

        if (!serverData) {
            const fileRes = await fetch('./data.json');
            if (fileRes.ok) serverData = await fileRes.json();
        }

        if (serverData && Object.keys(serverData).length) {
            portfolioData = mergePortfolioData(portfolioData, serverData);
        }
    } catch (e) {
        console.warn('Could not load data.json:', e);
    }

    if (isAdminContext) {
        const savedData = localStorage.getItem('portfolioData');
        if (savedData) {
            try {
                const parsed = JSON.parse(savedData);
                portfolioData = mergePortfolioData(portfolioData, parsed);
            } catch (e) {
                console.error('Error loading local admin data:', e);
            }
        }
    }
}

// Theme Management
function initializeTheme() {
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = document.getElementById('themeIcon');
    const html = document.documentElement;
    
    // Check settings or localStorage
    const savedTheme = localStorage.getItem('theme');
    const defaultDark = portfolioData.settings?.darkModeDefault || false;
    
    if (savedTheme === 'dark' || (!savedTheme && defaultDark)) {
        html.classList.add('dark');
        if (themeIcon) {
            themeIcon.classList.remove('fa-moon', 'text-gray-600');
            themeIcon.classList.add('fa-sun', 'text-yellow-400');
        }
    }
    
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }

    applyThemeColors();
}

function applyThemeColors() {
    const html = document.documentElement;
    const theme = portfolioData.settings?.themeColors || {};
    const isDark = html.classList.contains('dark');

    const colors = isDark ? {
        background: theme.darkBackground || '#0f172a',
        text: theme.darkText || '#f8fafc',
        gradientFrom: theme.darkGradientFrom || '#60a5fa',
        gradientTo: theme.darkGradientTo || '#a78bfa',
        gradientMid: theme.darkGradientMid || '#f0abfc',
        surface: theme.darkSurface || '#111827',
        surfaceStrong: theme.darkSurfaceStrong || '#1f2937',
        muted: '#9ca3af'
    } : {
        background: theme.lightBackground || '#f8fafc',
        text: theme.lightText || '#1f2937',
        gradientFrom: theme.lightGradientFrom || '#1e40af',
        gradientTo: theme.lightGradientTo || '#7c3aed',
        gradientMid: theme.lightGradientMid || '#c026d3',
        surface: theme.lightSurface || '#ffffff',
        surfaceStrong: theme.lightSurfaceStrong || '#f3f4f6',
        muted: '#6b7280'
    };

    html.style.setProperty('--site-bg', colors.background);
    html.style.setProperty('--site-text', colors.text);
    html.style.setProperty('--site-surface', colors.surface);
    html.style.setProperty('--site-surface-strong', colors.surfaceStrong);
    html.style.setProperty('--site-muted', colors.muted);
    html.style.setProperty('--site-gradient-from', colors.gradientFrom);
    html.style.setProperty('--site-gradient-to', colors.gradientTo);
    html.style.setProperty('--site-gradient-mid', colors.gradientMid);

    const navbar = document.getElementById('navbar');
    if (navbar) {
        navbar.style.backgroundColor = `${colors.surface}e6`;
        navbar.style.color = colors.text;
    }

    const footer = document.querySelector('footer');
    if (footer) {
        footer.style.backgroundColor = colors.surfaceStrong;
        footer.style.color = colors.text;
    }
}

function toggleTheme() {
    const html = document.documentElement;
    const themeIcon = document.getElementById('themeIcon');
    
    if (html.classList.contains('dark')) {
        html.classList.remove('dark');
        localStorage.setItem('theme', 'light');
        if (themeIcon) {
            themeIcon.classList.remove('fa-sun', 'text-yellow-400');
            themeIcon.classList.add('fa-moon', 'text-gray-600');
        }
    } else {
        html.classList.add('dark');
        localStorage.setItem('theme', 'dark');
        if (themeIcon) {
            themeIcon.classList.remove('fa-moon', 'text-gray-600');
            themeIcon.classList.add('fa-sun', 'text-yellow-400');
        }
    }

    applyThemeColors();
}

// Render All Sections
function renderAll() {
    applyThemeColors();
    renderProfile();
    renderSocialLinks();
    renderContact();
    renderMentors();
    renderExperience();
    renderAcademic();
    renderResearch();
    renderPublications();
    renderEvents();
    renderGallery();
    renderPublicLinks(typeof currentResourceFilter !== "undefined" ? currentResourceFilter : "all");
    renderFooter();
    updatePageTitle();
}

// Profile Section
function renderProfile() {
    const p = portfolioData.profile;
    
    // Update text elements
    const nameEl = document.getElementById('profileName');
    const titleEl = document.getElementById('profileTitle');
    const bioEl = document.getElementById('profileBio');
    
    if (nameEl) nameEl.textContent = p.name;
    if (titleEl) titleEl.textContent = p.title;
    if (bioEl) bioEl.textContent = p.bio;
    
    // Update photo
    const photoEl = document.getElementById('profilePhoto');
    if (photoEl) photoEl.src = p.photo;
    
    // Update keywords
    const keywordsContainer = document.getElementById('expertiseKeywords');
    if (keywordsContainer) {
        keywordsContainer.innerHTML = p.keywords.map(keyword => 
            `<span class="keyword-chip px-3 py-1 rounded-full text-sm text-primary-700 dark:text-primary-300">${keyword}</span>`
        ).join('');
    }
    
    // Update metrics
    if (portfolioData.settings?.showMetrics !== false) {
        updateMetric('metricCitations', p.metrics.citations);
        updateMetric('metricHIndex', p.metrics.hIndex);
        updateMetric('metricI10Index', p.metrics.i10Index);
        updateMetric('metricPublications', p.metrics.publications);
    }
    
    // Update contact links
    const emailLink = document.getElementById('contactEmail');
    const scholarLink = document.getElementById('contactScholar');
    const publicationsScholarLink = document.getElementById('scholarLink');
    
    if (emailLink) {
        emailLink.href = `mailto:${p.email}`;
        emailLink.innerHTML = `<i class="fas fa-envelope mr-2"></i>Send Email`;
    }
    if (scholarLink) {
        scholarLink.href = p.scholar;
    }
    if (publicationsScholarLink) {
        publicationsScholarLink.href = p.scholar || 'https://scholar.google.com/';
        publicationsScholarLink.target = '_blank';
        publicationsScholarLink.rel = 'noopener noreferrer';
        publicationsScholarLink.onclick = (event) => {
            if (!p.scholar) {
                event.preventDefault();
                return;
            }
            event.preventDefault();
            window.open(p.scholar, '_blank', 'noopener,noreferrer');
        };
    }
    
    // Animate metrics on scroll
    setupMetricAnimation();
}

function updateMetric(id, value) {
    const el = document.getElementById(id);
    if (el) {
        el.textContent = value.toLocaleString();
        el.classList.add('smooth-fade');
    }
}

function renderSocialLinks() {
    const container = document.getElementById('socialLinks');
    const footerContainer = document.getElementById('footerSocialLinks');

    const links = portfolioData.socialLinks || {};
    const items = [
        { key: 'twitter', href: links.twitter, icon: 'fab fa-x-twitter' },
        { key: 'linkedin', href: links.linkedin, icon: 'fab fa-linkedin-in' },
        { key: 'github', href: links.github, icon: 'fab fa-github' },
        { key: 'scholar', href: links.scholar || portfolioData.profile?.scholar, icon: 'fas fa-graduation-cap' },
        { key: 'orcid', href: links.orcid, icon: 'fab fa-orcid' },
        { key: 'researchgate', href: links.researchgate, icon: 'fab fa-researchgate' },
        { key: 'facebook', href: links.facebook, icon: 'fab fa-facebook-f' },
        { key: 'instagram', href: links.instagram, icon: 'fab fa-instagram' },
        { key: 'youtube', href: links.youtube, icon: 'fab fa-youtube' },
        { key: 'website', href: links.website, icon: 'fas fa-globe' }
    ].filter(item => item.href && item.href.trim() && item.href !== '#');

    const markup = items.map(item => `
        <a href="${item.href}" target="_blank" rel="noopener noreferrer" aria-label="${item.key}" class="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-primary-100 dark:hover:bg-primary-900 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
            <i class="${item.icon}"></i>
        </a>
    `).join('');

    if (container) container.innerHTML = markup;
    if (footerContainer) {
        footerContainer.innerHTML = items.map(item => `
            <a href="${item.href}" target="_blank" rel="noopener noreferrer" class="text-gray-400 hover:text-white transition-colors" aria-label="${item.key}">
                <i class="${item.icon}"></i>
            </a>
        `).join('');
    }
}

function renderContact() {
    const emailLink = document.getElementById('contactEmail');
    const scholarLink = document.getElementById('contactScholar');
    const messageEl = document.getElementById('contactMessage');

    const contact = portfolioData.contact || {};
    const email = contact.email || portfolioData.profile.email;
    const scholar = contact.scholar || portfolioData.profile.scholar;
    const message = contact.message || 'Interested in collaboration or have questions about my research? Feel free to reach out.';
    const emailLabel = contact.buttonTextEmail || 'Send Email';
    const scholarLabel = contact.buttonTextScholar || 'Google Scholar';

    if (emailLink) {
        emailLink.href = '#';
        emailLink.innerHTML = `<i class="fas fa-envelope mr-2"></i>${emailLabel}`;
        emailLink.onclick = (event) => {
            if (!email) {
                event.preventDefault();
                return;
            }
            event.preventDefault();
            const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(email)}`;
            window.open(gmailUrl, '_blank', 'noopener,noreferrer');
        };
    }

    if (scholarLink) {
        scholarLink.href = scholar || 'https://scholar.google.com/';
        scholarLink.target = '_blank';
        scholarLink.rel = 'noopener noreferrer';
        scholarLink.innerHTML = `<i class="fas fa-graduation-cap mr-2"></i>${scholarLabel}`;
        scholarLink.onclick = (event) => {
            if (!scholar) {
                event.preventDefault();
                return;
            }
            event.preventDefault();
            window.open(scholar, '_blank', 'noopener,noreferrer');
        };
    }

    if (messageEl) {
        messageEl.textContent = message;
    }
}

function renderMentors() {
    const container = document.getElementById('mentorsContainer');
    if (!container) return;

    const mentors = portfolioData.mentors || [];

    if (!mentors.length) {
        container.innerHTML = '<p class="text-center text-gray-500 dark:text-gray-400 col-span-full">No mentors or collaborators added yet.</p>';
        return;
    }

    container.innerHTML = mentors.map(mentor => `
        <div class="text-center group">
            <div class="w-24 h-24 mx-auto rounded-full overflow-hidden mb-4 border-4 border-primary-100 dark:border-primary-900 group-hover:border-primary-300 dark:group-hover:border-primary-700 transition-colors">
                <img src="${mentor.photo || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop'}" alt="${mentor.name}" class="w-full h-full object-cover">
            </div>
            <h3 class="font-bold text-gray-900 dark:text-white text-lg">${mentor.name}</h3>
            <p class="text-primary-600 dark:text-primary-400 text-sm">${mentor.institution}</p>
            <p class="text-gray-500 dark:text-gray-400 text-sm mt-2">${mentor.role}</p>
        </div>
    `).join('');
}

function setupMetricAnimation() {
    const metrics = document.querySelectorAll('.metric-counter');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    metrics.forEach(metric => observer.observe(metric));
}

function animateCounter(element) {
    const target = parseInt(element.textContent.replace(/,/g, '')) || 0;
    const duration = 2000;
    const start = 0;
    const startTime = performance.now();
    
    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const current = Math.floor(start + (target - start) * easeOutQuart);
        
        element.textContent = current.toLocaleString();
        
        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            element.textContent = target.toLocaleString();
        }
    }
    
    requestAnimationFrame(update);
}

// Experience Section — compact horizontal cards
function renderExperience() {
    const container = document.getElementById('experienceContainer');
    if (!container) return;

    container.innerHTML = portfolioData.experience.map((exp, idx) => `
        <div class="group relative flex gap-4 p-4 rounded-xl border border-gray-100 dark:border-gray-700/60 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-sm hover:shadow-md hover:border-primary-200 dark:hover:border-primary-700 transition-all duration-300">
            <div class="flex-shrink-0 w-1 self-stretch rounded-full bg-gradient-to-b from-primary-500 via-accent-500 to-primary-400 opacity-80 group-hover:opacity-100"></div>
            <div class="flex-1 min-w-0">
                <div class="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1 mb-1">
                    <h3 class="text-base font-bold text-gray-900 dark:text-white leading-snug">${exp.title}</h3>
                    <span class="text-xs font-semibold tracking-wide text-primary-600 dark:text-primary-400 whitespace-nowrap">${exp.period}</span>
                </div>
                <p class="text-sm font-medium text-gray-600 dark:text-gray-300 mb-1.5">${exp.organization}</p>
                <p class="text-xs text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-2">${exp.description}</p>
            </div>
        </div>
    `).join('');
}

// Academic Section — compact horizontal grid / cards
function renderAcademic() {
    const container = document.getElementById('academicContainer');
    if (!container) return;

    const items = portfolioData.academic || [];
    container.innerHTML = `
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            ${items.map((edu, idx) => `
                <div class="relative overflow-hidden rounded-xl border border-gray-100 dark:border-gray-700/60 bg-white dark:bg-gray-800 p-5 shadow-sm hover:shadow-lg transition-all duration-300 group">
                    <div class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-500 via-accent-500 to-primary-400"></div>
                    <div class="flex items-start justify-between gap-2 mb-3">
                        <span class="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-primary-50 dark:bg-primary-900/40 text-primary-600 dark:text-primary-300 text-sm font-bold">${idx + 1}</span>
                        <span class="text-[11px] font-semibold uppercase tracking-wider text-accent-600 dark:text-accent-400 bg-accent-50 dark:bg-accent-900/30 px-2 py-0.5 rounded">${edu.period}</span>
                    </div>
                    <h3 class="text-sm font-bold text-gray-900 dark:text-white leading-snug mb-1.5 line-clamp-2">${edu.degree}</h3>
                    <p class="text-xs font-medium text-primary-600 dark:text-primary-400 mb-2">${edu.institution}</p>
                    <p class="text-xs text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-3">${edu.description}</p>
                </div>
            `).join('')}
        </div>
    `;
}

// Research Section
function renderResearch() {
    const container = document.getElementById('researchContainer');
    if (!container) return;
    
    container.innerHTML = portfolioData.research.map(proj => `
        <div class="bg-gray-50 dark:bg-gray-700 rounded-xl p-6 shadow-md card-hover transition-colors duration-300 research-item" data-status="${proj.status}">
            <div class="flex justify-between items-start mb-3">
                <span class="px-3 py-1 rounded-full text-xs font-medium text-white ${proj.status === 'ongoing' ? 'status-ongoing' : 'status-published'}">
                    ${proj.status === 'ongoing' ? 'Ongoing' : 'Completed'}
                </span>
                <i class="fas fa-${proj.icon || 'flask'} text-primary-500 text-2xl"></i>
            </div>
            <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-2">${proj.title}</h3>
            <p class="text-gray-600 dark:text-gray-300 text-sm mb-4">${proj.description}</p>
            <div class="flex flex-wrap gap-2">
                ${proj.tags.map(tag => `<span class="text-xs px-2 py-1 bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 rounded">${tag}</span>`).join('')}
            </div>
        </div>
    `).join('');
}

// Publications Section
function renderPublications() {
    const container = document.getElementById('publicationsContainer');
    if (!container) return;
    
    container.innerHTML = portfolioData.publications.map(pub => `
        <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md transition-colors duration-300 publication-item" data-category="${pub.category}">
            <div class="flex flex-col md:flex-row justify-between items-start gap-4">
                <div class="flex-1">
                    <div class="flex items-center gap-2 mb-2">
                        <span class="px-2 py-1 rounded text-xs font-medium category-${pub.category}">${formatCategory(pub.category)}</span>
                        <span class="text-sm text-gray-500 dark:text-gray-400">${pub.journal}, ${pub.year}</span>
                    </div>
                    <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-2 hover:text-primary-600 dark:hover:text-primary-400 cursor-pointer transition-colors">${pub.title}</h3>
                    <p class="text-gray-600 dark:text-gray-300 text-sm mb-3">${pub.authors}</p>
                    <p class="text-gray-500 dark:text-gray-400 text-sm">${pub.description}</p>
                </div>
                <div class="flex items-center gap-4">
                    <div class="text-center">
                        <div class="text-2xl font-bold text-primary-600 dark:text-primary-400">${pub.citations}</div>
                        <div class="text-xs text-gray-500 dark:text-gray-400">Citations</div>
                    </div>
                    ${pub.doi ? `<a href="https://doi.org/${pub.doi}" target="_blank" class="p-2 text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors" title="Open DOI link">
                        <i class="fas fa-external-link-alt"></i>
                    </a>` : ''}
                </div>
            </div>
        </div>
    `).join('');
    
    // Setup filters
    setupPublicationFilters();
}

function formatCategory(cat) {
    const map = {
        'article': 'Article',
        'book_chapter': 'Book Chapter',
        'patent': 'Patent',
        'conference' : 'Conference Paper'
    };
    return map[cat] || cat;
}

function setupPublicationFilters() {
    const sortSelect = document.getElementById('sortSelect');
    const categorySelect = document.getElementById('categorySelect');
    const searchInput = document.getElementById('searchPublications');
    
    function filter() {
        const items = document.querySelectorAll('.publication-item');
        const searchTerm = searchInput?.value.toLowerCase() || '';
        const category = categorySelect?.value || 'all';
        
        items.forEach(item => {
            const text = item.textContent.toLowerCase();
            const cat = item.getAttribute('data-category');
            const matchesSearch = text.includes(searchTerm);
            const matchesCategory = category === 'all' || cat === category;
            
            item.style.display = matchesSearch && matchesCategory ? 'block' : 'none';
        });
        
        // Sort
        if (sortSelect) {
            const container = document.getElementById('publicationsContainer');
            const itemsArray = Array.from(items).filter(i => i.style.display !== 'none');
            // Sorting logic would go here based on data attributes
        }
    }
    
    if (sortSelect) sortSelect.addEventListener('change', filter);
    if (categorySelect) categorySelect.addEventListener('change', filter);
    if (searchInput) searchInput.addEventListener('input', filter);
}

// Events Section
function renderEvents() {
    const container = document.getElementById('eventsContainer');
    if (!container) return;

    const typeIcons = {
        'invited_talk': 'microphone',
        'conference': 'users',
        'workshop': 'tools',
        'seminar': 'chart-bar'
    };
    const typeColors = {
        'invited_talk': 'blue',
        'conference': 'green',
        'workshop': 'yellow',
        'seminar': 'pink'
    };

    container.innerHTML = (portfolioData.events || []).map(event => {
        const color = typeColors[event.type] || 'gray';
        const icon = typeIcons[event.type] || 'calendar';
        return `
        <div class="event-card group bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700/60 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden cursor-pointer"
             data-type="${event.type}" onclick="toggleEventExpand(${event.id})">
            <div class="p-4">
                <div class="flex items-start gap-3">
                    <div class="w-10 h-10 rounded-lg bg-${color}-100 dark:bg-${color}-900/50 flex items-center justify-center shrink-0">
                        <i class="fas fa-${icon} text-${color}-600 dark:text-${color}-400"></i>
                    </div>
                    <div class="flex-1 min-w-0">
                        <div class="flex flex-wrap items-center gap-2 mb-1">
                            <span class="px-2 py-0.5 rounded text-[10px] font-semibold event-type-${event.type}">${formatEventType(event.type)}</span>
                            <span class="text-[11px] text-gray-500 dark:text-gray-400">${formatDate(event.date)}</span>
                        </div>
                        <h3 class="text-sm font-bold text-gray-900 dark:text-white leading-snug line-clamp-2">${event.title}</h3>
                        <p class="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate">${event.location || ''}</p>
                    </div>
                    <i class="fas fa-chevron-down text-xs text-gray-400 transition-transform duration-300 event-chevron" id="event-chevron-${event.id}"></i>
                </div>
                <div id="event-detail-${event.id}" class="hidden mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                    <p class="text-xs text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">${event.description || ''}</p>
                </div>
            </div>
        </div>`;
    }).join('');

    setupEventFilters();
}

function toggleEventExpand(id) {
    const detail = document.getElementById('event-detail-' + id);
    const chevron = document.getElementById('event-chevron-' + id);
    if (!detail) return;
    const open = !detail.classList.contains('hidden');
    // close others
    document.querySelectorAll('[id^="event-detail-"]').forEach(el => el.classList.add('hidden'));
    document.querySelectorAll('[id^="event-chevron-"]').forEach(el => el.classList.remove('rotate-180'));
    if (!open) {
        detail.classList.remove('hidden');
        if (chevron) chevron.classList.add('rotate-180');
    }
}

function formatEventType(type) {
    const map = {
        'invited_talk': 'Invited Talk',
        'conference': 'Conference',
        'workshop': 'Workshop',
        'seminar': 'Seminar'
    };
    return map[type] || type;
}

function formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

function setupEventFilters() {
    const typeSelect = document.getElementById('eventTypeSelect');
    const searchInput = document.getElementById('searchEvents');
    
    function filter() {
        const items = document.querySelectorAll('#eventsContainer > div');
        const searchTerm = searchInput?.value.toLowerCase() || '';
        const type = typeSelect?.value || 'all';
        
        items.forEach(item => {
            const t = item.textContent.toLowerCase();
            const matchesSearch = t.includes(searchTerm);
            const matchesType = type === 'all' || (item.getAttribute('data-type') === type);
            item.style.display = matchesSearch && matchesType ? '' : 'none';
        });
    }
    
    if (typeSelect) typeSelect.addEventListener('change', filter);
    if (searchInput) searchInput.addEventListener('input', filter);
}

// Gallery Section
function renderGallery() {
    const container = document.getElementById('galleryContainer');
    if (!container) return;

    container.innerHTML = (portfolioData.gallery || []).map(item => `
        <div class="relative group overflow-hidden rounded-lg shadow-md cursor-pointer gallery-item aspect-square" onclick="openGalleryModal(${item.id})">
            <img src="${item.image}" alt="${item.title}" class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105">
            <div class="absolute inset-0 gallery-overlay opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
                <div>
                    <h3 class="text-white font-semibold text-sm leading-tight">${item.title}</h3>
                    <p class="text-gray-300 text-xs line-clamp-1">${item.description || ''}</p>
                </div>
            </div>
        </div>
    `).join('');
}

function openGalleryModal(id) {
    const item = portfolioData.gallery.find(g => g.id === id);
    if (!item) return;
    
    const modal = document.getElementById('galleryModal');
    const img = document.getElementById('galleryModalImage');
    const title = document.getElementById('galleryModalTitle');
    const desc = document.getElementById('galleryModalDescription');
    
    if (img) img.src = item.image;
    if (title) title.textContent = item.title;
    if (desc) desc.textContent = item.description;
    if (modal) modal.classList.remove('hidden');
}

let currentResourceFilter = 'all';

/** Extract YouTube video ID from common URL formats */
function extractYouTubeId(url) {
    if (!url) return null;
    const patterns = [
        /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
        /^([a-zA-Z0-9_-]{11})$/
    ];
    for (const p of patterns) {
        const m = url.match(p);
        if (m) return m[1];
    }
    return null;
}

/** Icon + style for a resource category (list view) */
function getResourceListMeta(link) {
    const category = (link.category || 'website');
    const catLower = category.toLowerCase();
    const url = link.url || '';
    const ytId = extractYouTubeId(url);

    if (catLower === 'videos' || ytId) {
        const id = ytId;
        return {
            kind: 'video',
            thumb: id ? `https://img.youtube.com/vi/${id}/mqdefault.jpg` : null,
            icon: 'fab fa-youtube',
            color: 'text-red-500',
            bg: 'bg-red-50 dark:bg-red-900/30'
        };
    }
    if (catLower === 'document' || catLower === 'lecture_notes' || catLower === 'books' || /\.pdf(\?|$)/i.test(url)) {
        const iconMap = { books: 'fas fa-book', lecture_notes: 'fas fa-chalkboard-teacher', document: 'fas fa-file-pdf' };
        return {
            kind: 'icon',
            icon: iconMap[catLower] || 'fas fa-file-pdf',
            color: 'text-red-600',
            bg: 'bg-red-50 dark:bg-red-900/30'
        };
    }
    if (catLower === 'repository' || /github\.com|gitlab\.com/i.test(url)) {
        return { kind: 'icon', icon: 'fab fa-github', color: 'text-gray-800 dark:text-gray-200', bg: 'bg-gray-100 dark:bg-gray-700' };
    }
    if (catLower === 'blogs') {
        return { kind: 'icon', icon: 'fas fa-rss', color: 'text-orange-500', bg: 'bg-orange-50 dark:bg-orange-900/30' };
    }
    if (catLower === 'image') {
        return { kind: 'icon', icon: 'fas fa-image', color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-900/30' };
    }
    // website – try favicon
    let favicon = null;
    try {
        if (url && url.startsWith('http')) {
            const u = new URL(url);
            favicon = `https://www.google.com/s2/favicons?domain=${u.hostname}&sz=64`;
        }
    } catch (_) {}
    return {
        kind: favicon ? 'favicon' : 'icon',
        thumb: favicon,
        icon: 'fas fa-globe',
        color: 'text-primary-600',
        bg: 'bg-primary-50 dark:bg-primary-900/30'
    };
}

function getLinkCategoryLabel(category) {
    const labels = {
        website: 'Website',
        repository: 'Tool / Repository',
        Videos: 'Videos',
        document: 'Document',
        image: 'Image',
        books: 'Books',
        blogs: 'Blogs',
        lecture_notes: 'Lecture Notes'
    };
    return labels[category] || (category ? category.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) : 'Resource');
}

/** Built-in + custom categories from data */
function getResourceCategories() {
    const builtIn = ['website', 'repository', 'Videos', 'document', 'image', 'books', 'blogs', 'lecture_notes'];
    const fromData = (portfolioData.links || []).map(l => l.category || 'website');
    const custom = (portfolioData.settings?.customLinkCategories || []);
    const all = [...new Set([...builtIn, ...fromData, ...custom])];
    return all;
}

function renderResourceFilters() {
    const el = document.getElementById('resourceFilters');
    if (!el) return;
    const cats = getResourceCategories();
    const current = currentResourceFilter || 'all';
    const btn = (cat, label, active) => `
        <button onclick="filterResources('${cat}', this)" class="resource-filter-btn px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${active ? 'bg-primary-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'}">
            ${label}
        </button>`;
    el.innerHTML = btn('all', 'All', current === 'all') +
        cats.map(c => btn(c, getLinkCategoryLabel(c), current === c)).join('');
}

function renderPublicLinks(categoryFilter = 'all') {
    const container = document.getElementById('linksContainer');
    if (!container) return;

    renderResourceFilters();

    const links = portfolioData?.links || [];
    const filteredLinks = categoryFilter === 'all'
        ? links
        : links.filter(link => (link.category || 'website') === categoryFilter);

    if (filteredLinks.length === 0) {
        container.innerHTML = `
            <div class="text-center py-8 text-gray-500 dark:text-gray-400 text-sm">
                <i class="fas fa-folder-open text-2xl mb-2 opacity-40"></i>
                <p>No resources in this category.</p>
            </div>`;
        return;
    }

    container.innerHTML = filteredLinks.map(link => {
        const category = link.category || 'website';
        const meta = getResourceListMeta(link);
        let mediaHtml = '';
        if (meta.kind === 'video' && meta.thumb) {
            mediaHtml = `
                <div class="relative w-20 h-12 rounded overflow-hidden shrink-0 bg-gray-200 dark:bg-gray-700">
                    <img src="${meta.thumb}" alt="" class="w-full h-full object-cover"
                         onerror="this.parentElement.innerHTML='<div class=\\'w-full h-full flex items-center justify-center ${meta.bg}\\'><i class=\\'${meta.icon} ${meta.color}\\'></i></div>'">
                    <div class="absolute inset-0 flex items-center justify-center bg-black/20">
                        <i class="fas fa-play text-white text-xs drop-shadow"></i>
                    </div>
                </div>`;
        } else if (meta.kind === 'favicon' && meta.thumb) {
            mediaHtml = `
                <div class="w-10 h-10 rounded-lg ${meta.bg} flex items-center justify-center shrink-0 overflow-hidden">
                    <img src="${meta.thumb}" alt="" class="w-5 h-5" onerror="this.style.display='none';this.nextElementSibling.style.display='inline'">
                    <i class="${meta.icon} ${meta.color} hidden"></i>
                </div>`;
        } else {
            mediaHtml = `
                <div class="w-10 h-10 rounded-lg ${meta.bg} flex items-center justify-center shrink-0">
                    <i class="${meta.icon} ${meta.color}"></i>
                </div>`;
        }

        return `
            <a href="${link.url || '#'}" target="_blank" rel="noopener noreferrer"
               class="flex items-center gap-3 px-3 py-2.5 rounded-lg border border-gray-100 dark:border-gray-700/50 bg-white dark:bg-gray-800/80 hover:bg-gray-50 dark:hover:bg-gray-700/80 hover:border-primary-200 dark:hover:border-primary-700 transition-all group">
                ${mediaHtml}
                <div class="flex-1 min-w-0">
                    <div class="flex items-center gap-2">
                        <h3 class="text-sm font-semibold text-gray-900 dark:text-white truncate group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                            ${link.title || 'Untitled'}
                        </h3>
                        <span class="hidden sm:inline text-[10px] font-medium px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 shrink-0">
                            ${getLinkCategoryLabel(category)}
                        </span>
                    </div>
                    <p class="text-xs text-gray-500 dark:text-gray-400 truncate">${link.description || ''}</p>
                </div>
                <i class="fas fa-external-link-alt text-[10px] text-gray-400 group-hover:text-primary-500 shrink-0"></i>
            </a>
        `;
    }).join('');
}

// Function triggered when clicking a filter button
function filterResources(category, btnElement) {
    currentResourceFilter = category;

    // Update active button styles
    document.querySelectorAll('.resource-filter-btn').forEach(btn => {
        btn.classList.remove('bg-primary-600', 'text-white');
        btn.classList.add('bg-gray-100', 'dark:bg-gray-700', 'text-gray-700', 'dark:text-gray-300');
    });

    if (btnElement) {
        btnElement.classList.remove('bg-gray-100', 'dark:bg-gray-700', 'text-gray-700', 'dark:text-gray-300');
        btnElement.classList.add('bg-primary-600', 'text-white');
    }

    renderPublicLinks(category);
}

function addLink() {
    if (!portfolioData.links) {
        portfolioData.links = [];
    }
    const newLink = {
        id: Date.now(),
        title: "New Resource",
        description: "Resource description",
        category: "website",
        url: "https://example.com"
    };
    portfolioData.links.unshift(newLink);
    saveData();
    renderLinks();
    showToast('New resource link added', 'success');
    addActivity('Added new resource link');
}

function updateLink(id, field, value) {
    const link = portfolioData.links.find(l => l.id === id);
    if (link) {
        link[field] = value;
        saveData();
        if (field === 'category') renderLinks(); // Re-render to update dynamic badge color styling
    }
}

function deleteLink(id) {
    if (confirm('Are you sure you want to delete this link?')) {
        portfolioData.links = portfolioData.links.filter(l => l.id !== id);
        saveData();
        renderLinks();
        showToast('Resource link deleted', 'info');
        addActivity('Deleted resource link');
    }
}

// Footer
function renderFooter() {
    const yearEl = document.getElementById('footerYear');
    const nameEl = document.getElementById('footerName');
    const updatedEl = document.getElementById('lastUpdated');
    
    if (yearEl) yearEl.textContent = new Date().getFullYear();
    if (nameEl) nameEl.textContent = portfolioData.settings?.footerText || portfolioData.profile.name;
    if (updatedEl) updatedEl.textContent = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

function updatePageTitle() {
    document.title = portfolioData.settings?.siteTitle || 'Academic Research Portfolio';
}

// Event Listeners
function setupEventListeners() {
    // Mobile menu
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
        
        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
            });
        });
    }
    
    // Research filters
    const researchFilters = document.querySelectorAll('.research-filter');
    researchFilters.forEach(filter => {
        filter.addEventListener('click', () => {
            researchFilters.forEach(f => {
                f.classList.remove('bg-primary-600', 'text-white', 'dark:bg-primary-700');
                f.classList.add('bg-gray-200', 'text-gray-700', 'dark:bg-gray-700', 'dark:text-gray-200');
            });
            filter.classList.remove('bg-gray-200', 'text-gray-700', 'dark:bg-gray-700', 'dark:text-gray-200');
            filter.classList.add('bg-primary-600', 'text-white', 'dark:bg-primary-700');
            
            const filterValue = filter.getAttribute('data-filter');
            const items = document.querySelectorAll('.research-item');
            
            items.forEach(item => {
                if (filterValue === 'all' || item.getAttribute('data-status') === filterValue) {
                    item.style.display = 'block';
                    item.classList.add('smooth-fade');
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
    
    // Close modals
    document.getElementById('closeGalleryModal')?.addEventListener('click', () => {
        document.getElementById('galleryModal')?.classList.add('hidden');
    });
    
    // Close modal on outside click
    window.addEventListener('click', (e) => {
        const galleryModal = document.getElementById('galleryModal');
        if (e.target === galleryModal) {
            galleryModal.classList.add('hidden');
        }
    });
    
    // Smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
    
    // Navbar scroll effect
    let lastScroll = 0;
    const navbar = document.getElementById('navbar');
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        if (currentScroll > 100) {
            navbar?.classList.add('shadow-md');
        } else {
            navbar?.classList.remove('shadow-md');
        }
        lastScroll = currentScroll;
    });
}

// Listen for storage changes (from admin panel)
window.addEventListener('storage', (e) => {
    if (e.key === 'portfolioData') {
        loadData();
        renderAll();
        showUpdateNotification();
    }
});

function showUpdateNotification() {
    // Create notification
    const notif = document.createElement('div');
    notif.className = 'fixed top-20 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 smooth-fade flex items-center gap-2';
    notif.innerHTML = '<i class="fas fa-sync-alt"></i> Content updated from admin panel';
    document.body.appendChild(notif);
    
    setTimeout(() => {
        notif.style.opacity = '0';
        setTimeout(() => notif.remove(), 300);
    }, 3000);
}

// Export for admin panel access
window.portfolioData = portfolioData;
window.renderAll = renderAll;
