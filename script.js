document.addEventListener("DOMContentLoaded", function () {
  // Configuration EmailJS - REMPLACEZ PAR VOS PROPRES CLÉS
  emailjs.init("96CMW61V_x3WkcDTO"); // Remplacez par votre clé publique

  // Gestion du menu mobile
  const menuToggle = document.getElementById("menu-toggle");
  const mobileMenu = document.getElementById("mobile-menu");
  const closeMenu = document.getElementById("close-menu");

  if (menuToggle && mobileMenu && closeMenu) {
    menuToggle.addEventListener("click", function () {
      mobileMenu.classList.remove("opacity-0", "invisible", "translate-y-4");
      mobileMenu.classList.add("opacity-100", "visible", "translate-y-0");
    });

    closeMenu.addEventListener("click", function () {
      mobileMenu.classList.remove("opacity-100", "visible", "translate-y-0");
      mobileMenu.classList.add("opacity-0", "invisible", "translate-y-4");
    });

    // Fermer le menu mobile lors du clic sur un lien
    const mobileLinks = mobileMenu.querySelectorAll('a[href^="#"]');
    mobileLinks.forEach(function (link) {
      link.addEventListener("click", function () {
        mobileMenu.classList.remove("opacity-100", "visible", "translate-y-0");
        mobileMenu.classList.add("opacity-0", "invisible", "translate-y-4");
      });
    });
  }

  // Défilement fluide pour tous les liens d'ancrage
  const anchorLinks = document.querySelectorAll('a[href^="#"]');
  anchorLinks.forEach(function (anchor) {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const targetId = this.getAttribute("href");
      const targetSection = document.querySelector(targetId);

      if (targetSection) {
        // Fermer le menu mobile si ouvert
        if (mobileMenu && !mobileMenu.classList.contains("hidden")) {
          mobileMenu.classList.remove(
            "opacity-100",
            "visible",
            "translate-y-0"
          );
          mobileMenu.classList.add("opacity-0", "invisible", "translate-y-4");
        }

        // Défilement fluide vers la section
        targetSection.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  });

  // Fonction pour afficher les messages de statut
  function showMessage(message, type) {
    const messageDiv = document.getElementById("form-message");
    messageDiv.textContent = message;
    messageDiv.className = `p-4 rounded-xl text-center font-medium ${
      type === "success"
        ? "bg-green-100 text-green-800 border border-green-300"
        : "bg-red-100 text-red-800 border border-red-300"
    }`;
    messageDiv.classList.remove("hidden");

    // Masquer le message après 5 secondes
    setTimeout(() => {
      messageDiv.classList.add("hidden");
    }, 5000);
  }

  // Gestion du formulaire de contact avec EmailJS
  const contactForm = document.getElementById("contact-form");

  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();

      // Validation des champs obligatoires
      const requiredFields = contactForm.querySelectorAll("[required]");
      let isValid = true;

      requiredFields.forEach(function (field) {
        if (!field.value.trim()) {
          isValid = false;
        } else {
        }
      });

      // Validation email
      const emailField = document.getElementById("email");
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (emailField.value && !emailPattern.test(emailField.value)) {
        isValid = false;
        emailField.classList.add("border-red-500");
        showMessage("Veuillez saisir une adresse email valide.", "error");
      }

      if (!isValid) {
        showMessage(
          "Veuillez remplir tous les champs obligatoires correctement.",
          "error"
        );
        return;
      }

      // Animation du bouton
      const submitBtn = document.getElementById("submit-btn");
      const originalText = submitBtn.textContent;

      submitBtn.textContent = "Envoi en cours...";
      submitBtn.disabled = true;

      // Préparer les données pour EmailJS
      const templateParams = {
        // to_email: "ph.robinet@gmail.com", // REMPLACEZ par votre email de réception
        from_name: `${contactForm.prenom.value} ${contactForm.nom.value}`,
        from_email: contactForm.email.value,
        phone: contactForm.telephone.value || "Non renseigné",
        subject: contactForm.motif.value || "Demande de contact",
        message: contactForm.message.value,
        reply_to: contactForm.email.value,
      };

      // Envoi via EmailJS
      emailjs
        .send(
          "service_nk2i788", // Remplacez par votre Service ID
          "template_cc5r09u", // Remplacez par votre Template ID
          templateParams
        )
        .then(function (response) {
          console.log("Email envoyé avec succès!", response);

          // Succès
          submitBtn.textContent = "Message envoyé !";
          submitBtn.classList.remove("bg-red-500", "hover:bg-red-600");
          submitBtn.classList.add("bg-green-500");

          showMessage(
            "Votre message a été envoyé avec succès ! Nous vous répondrons rapidement.",
            "success"
          );

          // Réinitialiser le formulaire
          contactForm.reset();

          // Remettre le bouton normal après 3 secondes
          setTimeout(function () {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            submitBtn.classList.remove("bg-green-500");
            submitBtn.classList.add("bg-red-500", "hover:bg-red-600");
          }, 3000);
        })
        .catch(function (error) {
          console.error("Erreur lors de l'envoi:", error);

          // Erreur
          submitBtn.textContent = originalText;
          submitBtn.disabled = false;

          showMessage(
            "Une erreur est survenue lors de l'envoi. Veuillez réessayer ou nous contacter directement.",
            "error"
          );
        });
    });
  }

  // Surligner le lien actif lors du défilement
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll('nav a[href^="#"]');

  function updateActiveLink() {
    let current = "";
    sections.forEach(function (section) {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (window.pageYOffset >= sectionTop - 200) {
        current = section.getAttribute("id");
      }
    });

    navLinks.forEach(function (link) {
      link.classList.remove("text-red-500");
      if (link.getAttribute("href") === "#" + current) {
        link.classList.add("text-red-500");
      }
    });
  }

  window.addEventListener("scroll", updateActiveLink);

  // Animation d'apparition au scroll (intersection observer)
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add("animate-fade-in");
      }
    });
  }, observerOptions);

  // Observer les sections principales
  const sectionsToObserve = document.querySelectorAll("section");
  sectionsToObserve.forEach(function (section) {
    observer.observe(section);
  });
});
