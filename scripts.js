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
    const savedData = localStorage.getItem('portfolioData');
    
    // 1. If LocalStorage exists, prioritize it
    if (savedData) {
        try {
            const parsed = JSON.parse(savedData);
            portfolioData = mergePortfolioData(portfolioData, parsed);
            return;
        } catch (e) {
            console.error('Error loading saved local data:', e);
        }
    }

    // 2. Fallback to server data if local storage is empty
    try {
        const response = await fetch('./data.json');
        if (response.ok) {
            const serverData = await response.json();
            portfolioData = mergePortfolioData(portfolioData, serverData);
            localStorage.setItem('portfolioData', JSON.stringify(portfolioData));
        }
    } catch (e) {
        console.warn('Could not load data from server document:', e);
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
    renderLinks();
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
        { key: 'twitter', href: links.twitter, icon: 'fab fa-twitter' },
        { key: 'linkedin', href: links.linkedin, icon: 'fab fa-linkedin-in' },
        { key: 'github', href: links.github, icon: 'fab fa-github' },
        { key: 'scholar', href: links.scholar || portfolioData.profile.scholar, icon: 'fas fa-graduation-cap' },
        { key: 'orcid', href: links.orcid, icon: 'fab fa-orcid' },
        { key: 'website', href: links.website, icon: 'fas fa-globe' }
    ].filter(item => item.href && item.href.trim());

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

// Experience Section
function renderExperience() {
    const container = document.getElementById('experienceContainer');
    if (!container) return;
    
    container.innerHTML = portfolioData.experience.map(exp => `
        <div class="bg-gray-50 dark:bg-gray-700 rounded-xl p-6 shadow-md transition-colors duration-300">
            <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-2">
                <h3 class="text-xl font-bold text-gray-900 dark:text-white">${exp.title}</h3>
                <span class="text-sm text-primary-600 dark:text-primary-400 font-medium">${exp.period}</span>
            </div>
            <p class="text-gray-600 dark:text-gray-300 font-medium mb-2">${exp.organization}</p>
            <p class="text-gray-500 dark:text-gray-400 text-sm">${exp.description}</p>
        </div>
    `).join('');
}

// Academic Section
function renderAcademic() {
    const container = document.getElementById('academicContainer');
    if (!container) return;
    
    const timelineLine = container.querySelector('.timeline-line');
    container.innerHTML = timelineLine ? timelineLine.outerHTML : '<div class="timeline-line hidden md:block"></div>';
    
    const content = portfolioData.academic.map(edu => `
        <div class="relative pl-12 md:pl-16 mb-8 last:mb-0">
            <div class="absolute left-4 md:left-5 top-0 w-4 h-4 rounded-full bg-primary-500 border-4 border-white dark:border-gray-800 shadow"></div>
            <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md transition-colors duration-300">
                <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-2">
                    <h3 class="text-xl font-bold text-gray-900 dark:text-white">${edu.degree}</h3>
                    <span class="text-sm text-accent-600 dark:text-accent-400 font-medium">${edu.period}</span>
                </div>
                <p class="text-gray-600 dark:text-gray-300 font-medium mb-2">${edu.institution}</p>
                <p class="text-gray-500 dark:text-gray-400 text-sm">${edu.description}</p>
            </div>
        </div>
    `).join('');
    
    container.innerHTML += content;
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
    
    container.innerHTML = portfolioData.events.map(event => {
        const color = typeColors[event.type] || 'gray';
        const icon = typeIcons[event.type] || 'calendar';
        
        return `
        <div class="bg-gray-50 dark:bg-gray-700 rounded-xl p-6 shadow-md transition-colors duration-300 flex flex-col md:flex-row gap-4 items-start">
            <div class="flex-shrink-0">
                <div class="w-16 h-16 rounded-lg bg-${color}-100 dark:bg-${color}-900 flex items-center justify-center">
                    <i class="fas fa-${icon} text-${color}-600 dark:text-${color}-400 text-2xl"></i>
                </div>
            </div>
            <div class="flex-1">
                <div class="flex items-center gap-2 mb-1">
                    <span class="px-2 py-1 rounded text-xs font-medium event-type-${event.type}">${formatEventType(event.type)}</span>
                    <span class="text-sm text-gray-500 dark:text-gray-400">${formatDate(event.date)}</span>
                </div>
                <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-1">${event.title}</h3>
                <p class="text-gray-600 dark:text-gray-300 text-sm mb-2">${event.location}</p>
                <p class="text-gray-500 dark:text-gray-400 text-sm">${event.description}</p>
            </div>
        </div>
    `}).join('');
    
    setupEventFilters();
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
            const text = item.textContent.toLowerCase();
            const matchesSearch = text.includes(searchTerm);
            const matchesType = type === 'all' || item.innerHTML.includes(`event-type-${type}`);
            
            item.style.display = matchesSearch && matchesType ? 'flex' : 'none';
        });
    }
    
    if (typeSelect) typeSelect.addEventListener('change', filter);
    if (searchInput) searchInput.addEventListener('input', filter);
}

// Gallery Section
function renderGallery() {
    const container = document.getElementById('galleryContainer');
    if (!container) return;
    
    container.innerHTML = portfolioData.gallery.map(item => `
        <div class="relative group overflow-hidden rounded-xl shadow-lg cursor-pointer gallery-item" onclick="openGalleryModal(${item.id})">
            <img src="${item.image}" alt="${item.title}" class="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110">
            <div class="absolute inset-0 gallery-overlay opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                <div>
                    <h3 class="text-white font-bold text-lg">${item.title}</h3>
                    <p class="text-gray-300 text-sm">${item.description}</p>
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

function renderPublicLinks(categoryFilter = 'all') {
    const container = document.getElementById('linksContainer');
    if (!container) return;

    const links = portfolioData?.links || [];

    // Filter items based on selected category tab
    const filteredLinks = categoryFilter === 'all' 
        ? links 
        : links.filter(link => (link.category || 'website') === categoryFilter);

    if (filteredLinks.length === 0) {
        container.innerHTML = `
            <div class="col-span-full text-center py-8 text-gray-500 dark:text-gray-400">
                No resources found in this category.
            </div>`;
        return;
    }

    container.innerHTML = filteredLinks.map(link => {
        const category = link.category || 'website';

        let iconClass = 'fas fa-globe';
        if (category === 'repository') iconClass = 'fas fa-code';
        if (category === 'Videos') iconClass = 'fas fa-video';
        if (category === 'document') iconClass = 'fas fa-file-pdf';

        const categoryLabels = {
            website: 'Website',
            repository: 'Tool / Repository',
            Videos: 'Videos',
            document: 'Document'
        };

        return `
            <a href="${link.url || '#'}" target="_blank" rel="noopener noreferrer" 
               class="flex flex-col justify-between p-5 bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 group">
                <div class="flex items-start gap-4 mb-3">
                    <div class="w-12 h-12 rounded-lg bg-primary-100 dark:bg-primary-900/50 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                        <i class="${iconClass} text-primary-600 dark:text-primary-400 text-lg"></i>
                    </div>
                    <div class="flex-1 min-w-0">
                        <h3 class="font-bold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors truncate">
                            ${link.title || 'Untitled Resource'}
                        </h3>
                        <p class="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mt-1">
                            ${link.description || ''}
                        </p>
                    </div>
                </div>
                <div class="flex justify-between items-center pt-2 border-t border-gray-200/50 dark:border-gray-600/50">
                    <span class="text-xs font-semibold px-2 py-0.5 rounded bg-primary-50 dark:bg-primary-900/40 text-primary-600 dark:text-primary-300 uppercase tracking-wider">
                        ${categoryLabels[category] || 'Resource'}
                    </span>
                    <i class="fas fa-external-link-alt text-xs text-gray-400 group-hover:text-primary-500 transition-colors"></i>
                </div>
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

// Automatically load when index.html loads
document.addEventListener('DOMContentLoaded', () => {
    renderPublicLinks();
});

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
