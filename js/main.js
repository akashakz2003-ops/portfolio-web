/**
 * AKASH — AI Content Creator & Creative Developer Portfolio
 * Production JavaScript: Entrance sequence, parallax, project lightbox,
 * audio synthesis, magnetic cursor, filtering, and responsive interactions.
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // --- 1. Sound Synthesis Engine (Web Audio API) ---
  class SoundEngine {
    constructor() {
      this.enabled = false;
      this.ctx = null;
      this.toggleBtn = document.getElementById('soundToggle');
    }

    init() {
      if (this.toggleBtn) {
        this.toggleBtn.addEventListener('click', () => this.toggle());
      }
    }

    ensureCtx() {
      if (!this.ctx) {
        try {
          const AudioCtx = window.AudioContext || window.webkitAudioContext;
          if (AudioCtx) {
            this.ctx = new AudioCtx();
          }
        } catch (e) {
          console.warn('Web Audio not supported', e);
        }
      }
    }

    toggle() {
      this.ensureCtx();
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }

      this.enabled = !this.enabled;
      if (this.toggleBtn) {
        this.toggleBtn.classList.toggle('playing', this.enabled);
        const label = this.toggleBtn.querySelector('.sound-label');
        if (label) {
          label.textContent = this.enabled ? 'SOUND ON' : 'SOUND OFF';
        }
      }

      if (this.enabled) {
        this.playChime();
      }
    }

    playClick() {
      if (!this.enabled || !this.ctx) return;
      try {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(440, this.ctx.currentTime + 0.04);
        gain.gain.setValueAtTime(0.04, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.04);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.04);
      } catch (e) {}
    }

    playWhoosh() {
      if (!this.enabled || !this.ctx) return;
      try {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(140, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(280, this.ctx.currentTime + 0.12);
        gain.gain.setValueAtTime(0.02, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.12);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.12);
      } catch (e) {}
    }

    playChime() {
      if (!this.enabled || !this.ctx) return;
      try {
        const notes = [523.25, 659.25, 783.99];
        notes.forEach((freq, i) => {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, this.ctx.currentTime + i * 0.08);
          gain.gain.setValueAtTime(0.03, this.ctx.currentTime + i * 0.08);
          gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + i * 0.08 + 0.35);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(this.ctx.currentTime + i * 0.08);
          osc.stop(this.ctx.currentTime + i * 0.08 + 0.35);
        });
      } catch (e) {}
    }
  }

  const sound = new SoundEngine();
  sound.init();

  // --- 2. Hero Entrance Animation Sequencer ---
  // Sequence specified in prompt:
  // 1. Black screen appears
  // 2. Giant "AI CONTENT CREATOR" typography slowly fades/slides into position
  // 3. Portrait smoothly reveals from behind typography
  // 4. "Akash" signature draws/reveals naturally
  // 5. VIEW WORK and CONTACT ME buttons fade upward into view
  // 6. Navigation appears subtly
  window.addEventListener('load', () => {
    setTimeout(() => {
      document.body.classList.add('loaded');
      sound.playWhoosh();
    }, 150);
  });

  // Fallback in case load already fired
  if (document.readyState === 'complete') {
    setTimeout(() => {
      document.body.classList.add('loaded');
    }, 150);
  }

  // Jump to section if ?scroll=... query param is present
  const urlParams = new URLSearchParams(window.location.search);
  const scrollTarget = urlParams.get('scroll');
  if (scrollTarget) {
    const targetEl = document.getElementById(scrollTarget);
    if (targetEl) {
      document.documentElement.style.scrollBehavior = 'auto';
      window.scrollTo(0, targetEl.offsetTop);
      document.documentElement.style.scrollBehavior = '';
    }
  }

  // --- 3. Scroll Interactions & Hero Parallax ---
  const navHeader = document.querySelector('.nav-header');
  const heroTypography = document.querySelector('.hero-typography-stage');
  const heroPortrait = document.querySelector('.hero-portrait-stage');
  const heroSection = document.querySelector('.hero-section');

  let ticking = false;

  function onScroll() {
    const scrollY = window.pageYOffset || document.documentElement.scrollTop;

    // Navbar translucent blur on scroll
    if (navHeader) {
      if (scrollY > 50) {
        navHeader.classList.add('scrolled');
      } else {
        navHeader.classList.remove('scrolled');
      }
    }

    // Parallax on hero elements (only active while hero is in viewport)
    if (heroSection && scrollY < window.innerHeight * 1.2) {
      if (heroTypography) {
        // Typography moves slightly slower
        heroTypography.style.transform = `translate(-50%, calc(-50% + ${scrollY * 0.28}px))`;
      }
      if (heroPortrait) {
        // Portrait moves at foreground rate
        heroPortrait.style.transform = `translate(-50%, ${scrollY * 0.12}px)`;
      }
    }

    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(onScroll);
      ticking = true;
    }
  }, { passive: true });

  // --- 4. Smooth Anchor Scrolling ---
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        sound.playClick();
        
        // Close mobile drawer if open
        const mobileDrawer = document.getElementById('mobileDrawer');
        const mobileToggle = document.getElementById('mobileToggle');
        if (mobileDrawer && mobileDrawer.classList.contains('open')) {
          mobileDrawer.classList.remove('open');
          if (mobileToggle) mobileToggle.classList.remove('active');
          document.body.style.overflow = '';
        }

        const navHeight = navHeader ? navHeader.offsetHeight : 0;
        const targetPos = targetEl.getBoundingClientRect().top + window.pageYOffset - (navHeight * 0.5);

        window.scrollTo({
          top: targetPos,
          behavior: 'smooth'
        });
      }
    });
  });

  // --- 5. Mobile Navigation Drawer ---
  const mobileToggle = document.getElementById('mobileToggle');
  const mobileDrawer = document.getElementById('mobileDrawer');

  if (mobileToggle && mobileDrawer) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = mobileDrawer.classList.toggle('open');
      mobileToggle.classList.toggle('active', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
      sound.playClick();
    });
  }

  // --- 6. Custom Magnetic Cursor (Desktop) ---
  const cursorDot = document.querySelector('.cursor-dot');
  const cursorFollower = document.querySelector('.cursor-follower');

  if (cursorDot && cursorFollower && window.matchMedia('(pointer: fine)').matches) {
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let followerX = mouseX;
    let followerY = mouseY;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursorDot.style.left = `${mouseX}px`;
      cursorDot.style.top = `${mouseY}px`;
    });

    function animateFollower() {
      followerX += (mouseX - followerX) * 0.15;
      followerY += (mouseY - followerY) * 0.15;
      cursorFollower.style.left = `${followerX}px`;
      cursorFollower.style.top = `${followerY}px`;
      requestAnimationFrame(animateFollower);
    }
    requestAnimationFrame(animateFollower);

    // Hover state on interactive elements
    const hoverTargets = document.querySelectorAll('a, button, .project-card, .service-card, .tool-pill, input, select, textarea');
    hoverTargets.forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursorFollower.classList.add('cursor-hover');
        sound.playWhoosh();
      });
      el.addEventListener('mouseleave', () => {
        cursorFollower.classList.remove('cursor-hover');
      });
    });
  }

  // --- 7. Project Data & Full Lightbox Modal ---
  const projectsData = [
    {
      id: 'cinematic',
      category: 'AI Cinematic Videos',
      title: 'JABAL SALALAH: CITRUS',
      year: '2026 / Cinematic Commercial',
      client: 'Jabal Salalah Beverages',
      image: 'assets/images/project-jabal.jpg',
      video: 'videos/jabal%20salala%201.mov',
      description: 'High-energy cinematic 3D beverage commercial for Jabal Salalah Citrus. Engineered with electric neon lime rim illumination, photorealistic water droplet physics, sub-zero vapor atmosphere, and textured volcanic rock terrain.',
      tools: ['Runway Gen-3 Alpha', 'ComfyUI / LoRA', 'Cinema 4D', 'DaVinci Resolve Studio'],
      promptConcept: 'Cinematic 3D commercial of an ice-cold Jabal Salalah citrus carbonated beverage can, glowing neon lime green rim light against matte black swirling wave graphics, dripping condensation water droplets, dense vapor smoke, wet dark volcanic pedestal, 8k ultra-detailed.'
    },
    {
      id: 'advertising',
      category: 'AI Advertising',
      title: 'ABBA: PROUD OUD LEATHER',
      year: '2026 / Luxury Commercial',
      client: 'Abba Perfumes',
      image: 'assets/images/project-abba.jpg',
      video: 'videos/abba%20leather%203.mov',
      description: 'High-fashion luxury fragrance commercial for Abba Perfumes featuring the bespoke Proud Oud Leather flacon. Cinematic silhouette framing against textured marble, museum chiaroscuro lighting, slow-motion atomized perfume mist, and refined brand presence.',
      tools: ['Runway Gen-3 Alpha', 'ComfyUI Pipelines', 'Cinema 4D', 'DaVinci Resolve Studio'],
      promptConcept: 'High-fashion luxury perfume commercial, Middle Eastern model in keffiyeh silhouetted under sharp overhead studio rim light, holding matte black Proud Oud Leather bottle on black marble pedestal, fine atomized mist spray, 4k ultra-detailed.'
    },
    {
      id: 'product',
      category: 'AI Product Visualization',
      title: 'RED TAPE',
      year: '2026 / Footwear Commercial',
      client: 'Red Tape Footwear & Lifestyle',
      image: 'assets/images/project-redtape.png',
      video: 'videos/Red%20Tap.mp4',
      description: 'Dynamic 360-degree commercial product visualization for Red Tape luxury lifestyle sneakers. Features studio turntable motion choreography, photorealistic metallic mesh textures, aerodynamic sole detailing, and mirror floor reflections.',
      tools: ['ComfyUI Video Pipelines', 'Runway Gen-3', 'Cinema 4D', 'DaVinci Resolve Studio'],
      promptConcept: 'Commercial 360-degree product turntable showcase of modern Red Tape futuristic metallic silver runner sneakers, clean minimalist studio cyclorama with glossy mirror floor reflections, studio lighting, hyper-realistic shoe textures, commercial grade 8k.'
    },
    {
      id: 'reels',
      category: 'Social Media Reels',
      title: 'MASTER DAMU',
      year: '2026 / Viral AI Reel',
      client: 'Malayalam Pop Culture / Social Viral',
      image: 'assets/images/project-damu.jpg',
      video: 'videos/master%20damu.mp4',
      description: 'Hyper-realistic AI cinematic viral reel bringing the iconic pop-culture character Master Damu to life in a high-octane Kerala street chase sequence. Engineered with high-fidelity facial consistency, physics-driven clothing dynamics, authentic Indian urban environment, and cinematic handheld tracking.',
      tools: ['Runway Gen-3 Alpha', 'Luma Dream Machine', 'ComfyUI / LoRA', 'DaVinci Resolve Studio'],
      promptConcept: 'Cinematic hyper-realistic Malayalam comedy chase sequence, expressive middle-aged Indian man with mustache wearing lungi and mustard shirt running frantically after a red and white KSRTC bus on a sunlit Kerala town street, photorealistic 35mm film grain, 4k.'
    },
    {
      id: 'paradise',
      category: 'Social Media Reels',
      title: 'PARADISE',
      year: '2026 / Viral AI Reel',
      client: 'Pop Culture / Dance Homage',
      image: 'assets/images/project-paradise.jpg',
      video: 'videos/paradise.mp4',
      description: 'High-octane cinematic AI viral reel reimagining an iconic disco pop legend performing amidst an electric Kerala crowd. Features retro vehicle choreography, dusty atmospheric sunlight, dynamic crowd energy, and authentic period styling.',
      tools: ['Runway Gen-3 Alpha', 'ComfyUI / LoRA', 'Kling AI', 'DaVinci Resolve Studio'],
      promptConcept: 'Cinematic 35mm film still of a legendary pop star in sparkling black and silver star disco suit dancing in a sunlit dusty Kerala town square, surrounded by cheering crowd, vintage Bajaj Chetak scooters and Enfield bullets, anamorphic warm haze, 4k.'
    }
  ];

  const projectModal = document.getElementById('projectModal');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const modalImg = document.getElementById('modalImg');
  const modalVideo = document.getElementById('modalVideo');
  const modalCategory = document.getElementById('modalCategory');
  const modalYear = document.getElementById('modalYear');
  const modalTitle = document.getElementById('modalTitle');
  const modalDesc = document.getElementById('modalDesc');
  const modalClient = document.getElementById('modalClient');
  const modalTools = document.getElementById('modalTools');
  const modalPrompt = document.getElementById('modalPrompt');

  function openProjectModal(projectId) {
    const project = projectsData.find(p => p.id === projectId);
    if (!project) return;

    if (project.video) {
      if (modalVideo) {
        modalVideo.src = project.video;
        if (project.image) modalVideo.poster = project.image;
        modalVideo.style.display = 'block';
        modalVideo.currentTime = 0;
        modalVideo.play().catch(() => {});
      }
      if (modalImg) modalImg.style.display = 'none';
    } else {
      if (modalVideo) {
        modalVideo.pause();
        modalVideo.removeAttribute('src');
        modalVideo.style.display = 'none';
      }
      if (modalImg) {
        modalImg.style.display = 'block';
        modalImg.src = project.image;
        modalImg.alt = project.title;
      }
    }

    if (modalCategory) modalCategory.textContent = project.category;
    if (modalYear) modalYear.textContent = project.year;
    if (modalTitle) modalTitle.textContent = project.title;
    if (modalDesc) modalDesc.textContent = project.description;
    if (modalClient) modalClient.textContent = project.client;
    if (modalTools) modalTools.textContent = project.tools.join(' • ');
    if (modalPrompt) modalPrompt.textContent = `"${project.promptConcept}"`;

    // Toggle Modal Reel Switcher for Social Media Reels
    const modalReelSwitcher = document.getElementById('modalReelSwitcher');
    if (modalReelSwitcher) {
      if (projectId === 'reels' || projectId === 'paradise') {
        modalReelSwitcher.style.display = 'inline-flex';
        modalReelSwitcher.querySelectorAll('.reel-tab-btn').forEach(btn => {
          btn.classList.toggle('active', btn.getAttribute('data-modal-reel') === projectId);
        });
      } else {
        modalReelSwitcher.style.display = 'none';
      }
    }

    if (projectModal) {
      projectModal.classList.add('active');
      document.body.style.overflow = 'hidden';
      sound.playWhoosh();
    }
  }

  function closeProjectModal() {
    if (modalVideo) {
      modalVideo.pause();
      modalVideo.currentTime = 0;
    }
    if (projectModal) {
      projectModal.classList.remove('active');
      document.body.style.overflow = '';
      sound.playClick();
    }
  }

  // Open modal on project card click
  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('click', (e) => {
      if (e.target.closest('.reel-tab-btn')) return;
      const pid = card.getAttribute('data-project-id');
      if (pid) openProjectModal(pid);
    });
  });

  // --- 7b. Reel Switcher Handler (Master Damu & Paradise) ---
  const reelsProjectCard = document.getElementById('reelsProjectCard');
  const reelCardVideo = document.getElementById('reelCardVideo');
  const reelCardTitle = document.getElementById('reelCardTitle');
  const reelCardDesc = document.getElementById('reelCardDesc');
  const reelCardTags = document.getElementById('reelCardTags');
  const reelCardYear = document.getElementById('reelCardYear');
  const modalReelSwitcher = document.getElementById('modalReelSwitcher');

  const reelsDataMap = {
    reels: projectsData.find(p => p.id === 'reels'),
    paradise: projectsData.find(p => p.id === 'paradise')
  };

  function syncReelCard(reelId) {
    const data = reelsDataMap[reelId];
    if (!data || !reelsProjectCard) return;

    reelsProjectCard.setAttribute('data-project-id', reelId);

    if (reelCardVideo) {
      reelCardVideo.src = data.video;
      reelCardVideo.poster = data.image;
      reelCardVideo.currentTime = 0;
      reelCardVideo.play().catch(() => {});
    }

    if (reelCardTitle) reelCardTitle.textContent = data.title;
    if (reelCardDesc) reelCardDesc.textContent = data.description;
    if (reelCardYear) reelCardYear.textContent = '2026';

    if (reelCardTags) {
      if (reelId === 'reels') {
        reelCardTags.innerHTML = `
          <span class="project-tag">AI Cinematic Reel</span>
          <span class="project-tag">Character Consistency</span>
          <span class="project-tag">Viral Motion</span>
        `;
      } else {
        reelCardTags.innerHTML = `
          <span class="project-tag">Viral AI Reel</span>
          <span class="project-tag">Pop Culture Homage</span>
          <span class="project-tag">Crowd Choreography</span>
        `;
      }
    }

    // Update active tab styling on card
    reelsProjectCard.querySelectorAll('.reel-tab-btn').forEach(b => {
      b.classList.toggle('active', b.getAttribute('data-reel-id') === reelId);
    });
  }

  if (reelsProjectCard) {
    reelsProjectCard.querySelectorAll('.reel-tab-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const reelId = btn.getAttribute('data-reel-id');
        if (reelId) {
          sound.playClick();
          syncReelCard(reelId);
        }
      });
    });
  }

  if (modalReelSwitcher) {
    modalReelSwitcher.querySelectorAll('.reel-tab-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const targetId = btn.getAttribute('data-modal-reel');
        if (targetId) {
          sound.playClick();
          openProjectModal(targetId);
          syncReelCard(targetId);
        }
      });
    });
  }

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeProjectModal);
  }

  if (projectModal) {
    projectModal.addEventListener('click', (e) => {
      if (e.target === projectModal) {
        closeProjectModal();
      }
    });
  }

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && projectModal && projectModal.classList.contains('active')) {
      closeProjectModal();
    }
  });

  // --- 8. Project Filter Tabs ---
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      sound.playClick();

      const filter = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(15px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 250);
        }
      });
    });
  });

  // --- 9. One-Click Email Copy Feature ---
  const copyEmailBtn = document.getElementById('copyEmailBtn');
  if (copyEmailBtn) {
    copyEmailBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const email = 'akashakz2003@gmail.com';
      navigator.clipboard.writeText(email).then(() => {
        sound.playChime();
        const originalText = copyEmailBtn.innerHTML;
        copyEmailBtn.innerHTML = '<span>COPIED TO CLIPBOARD!</span> <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4ade80" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>';
        setTimeout(() => {
          copyEmailBtn.innerHTML = originalText;
        }, 2500);
      }).catch(err => {
        console.error('Failed to copy', err);
      });
    });
  }

  // --- 10. Direct Inquiry Form Handler (WhatsApp Integration) ---
  const inquiryForm = document.getElementById('inquiryForm');
  const formStatus = document.getElementById('formStatus');

  if (inquiryForm) {
    inquiryForm.addEventListener('submit', (e) => {
      e.preventDefault();
      sound.playChime();

      const nameInput = document.getElementById('userName');
      const emailInput = document.getElementById('userEmail');
      const projectTypeInput = document.getElementById('projectType');
      const messageInput = document.getElementById('userMessage');

      const name = nameInput ? nameInput.value.trim() : '';
      const email = emailInput ? emailInput.value.trim() : '';
      const projectType = projectTypeInput ? projectTypeInput.value : '';
      const message = messageInput ? messageInput.value.trim() : '';

      // Format WhatsApp message with all client details
      const whatsappText = `*New Portfolio Inquiry* 🎬\n\n` +
        `👤 *Client Name:* ${name}\n` +
        `✉️ *Email Address:* ${email}\n` +
        `🎯 *Project Category:* ${projectType}\n\n` +
        `📝 *Project Vision & Details:*\n${message}\n\n` +
        `— Sent via Akash Portfolio`;

      const whatsappUrl = `https://wa.me/918129274356?text=${encodeURIComponent(whatsappText)}`;

      // Open WhatsApp directly
      window.open(whatsappUrl, '_blank');

      if (formStatus) {
        formStatus.classList.add('success');
        formStatus.innerHTML = '✓ REDIRECTING TO WHATSAPP (+91 81292 74356)...';
      }

      const submitBtn = inquiryForm.querySelector('.form-submit-btn');
      if (submitBtn) {
        const originalBtnHtml = submitBtn.innerHTML;
        submitBtn.innerHTML = '<span>OPENING WHATSAPP...</span>';
        setTimeout(() => {
          submitBtn.innerHTML = originalBtnHtml;
          inquiryForm.reset();
        }, 3000);
      }
    });
  }

  // --- 11. Live Local Clock in Footer ---
  const clockElement = document.getElementById('liveClock');
  function updateClock() {
    if (!clockElement) return;
    try {
      const options = {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      };
      const formatter = new Intl.DateTimeFormat([], options);
      clockElement.textContent = `${formatter.format(new Date())} IST`;
    } catch (e) {
      const now = new Date();
      clockElement.textContent = now.toLocaleTimeString();
    }
  }
  updateClock();
  setInterval(updateClock, 1000);

  // --- 12. Back To Top Button ---
  const backToTopBtn = document.getElementById('backToTopBtn');
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      sound.playWhoosh();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  console.log('Akash Portfolio initialized successfully.');
});
