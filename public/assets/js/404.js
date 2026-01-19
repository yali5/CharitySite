/*
	Hyperspace by HTML5 UP
	html5up.net | @ajlkn
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)

	Modified: Adds a lightweight client-side 404 handler for non-hash routes
	so Vite dev/preview doesn't appear to "redirect to home" for unknown URLs.
*/

(function ($) {
  var $window = $(window),
    $body = $("body"),
    $sidebar = $("#sidebar");

  /* --------------------------------------------
   * 404 HANDLER (no framework router)
   *
   * How it works:
   * - Hyperspace is a one-page template that expects navigation via #hash.
   * - In Vite dev, /anything serves index.html, so you must decide what to show.
   * - If the URL has a pathname other than "/" (or "/index.html"), we show a 404 UI.
   *
   * If you want to allow real paths (e.g. /contact), add them to ALLOWED_PATHS.
   * ------------------------------------------ */

  var ALLOWED_PATHS = new Set([
    "/",          // home
    "/index.html" // some hosts
    // Add more if you truly have separate pages:
    // "/contact",
    // "/about"
  ]);

  function show404() {
    // If you already have a 404 section in the page, use it. Otherwise inject markup.
    var $existing404 = $("#page404");

    // Hide the rest of the page content (keep body, but remove main layout visibility).
    // Adjust selectors to match your template if needed.
    $("#wrapper, #sidebar, #header").hide();

    $body.addClass("is-404");

    if ($existing404.length) {
      $existing404.show();
      return;
    }

    // Inject a simple 404 block (you can replace this with your own split 404 HTML)
    var html =
      '<main id="page404" class="container404" role="main" aria-label="404 Page Not Found">' +
      '  <div class="content404">' +
      '    <p class="error-code404">404</p>' +
      '    <h1 class="title404">Page not found</h1>' +
      '    <p class="description404">Sorry, we couldn’t find the page you’re looking for.</p>' +
      '    <div class="actions404">' +
      '      <a href="/" class="btn-primary404" id="homeBtn404">Go back home</a>' +
      '      <a href="/contact" class="btn-link404" id="supportBtn404">Contact support <span aria-hidden="true">→</span></a>' +
      "    </div>" +
      "  </div>" +
      "</main>";

    $body.append(html);

    // Basic handlers (optional)
    $(document).on("click", "#homeBtn404", function (e) {
      // If you want to stay as a one-pager, you can use hash:
      // location.href = "/#top";
      // Otherwise, just go to /
      // Let the browser navigate normally:
    });
  }

  // If we landed on a non-hash path that the site doesn't support, show 404.
  // Note: hash routes like /#intro are fine.
  (function maybeShow404() {
    var path = window.location.pathname || "/";
    var hasHash = !!window.location.hash;

    // If it's a normal one-page Hyperspace site:
    // - valid navigation is #hash
    // - valid "path" is "/" (or index.html)
    // Anything else should show 404 (unless you add it to ALLOWED_PATHS)
    if (!ALLOWED_PATHS.has(path) && !hasHash) {
      show404();
    }
  })();

  // Breakpoints.
  breakpoints({
    xlarge: ["1281px", "1680px"],
    large: ["981px", "1280px"],
    medium: ["737px", "980px"],
    small: ["481px", "736px"],
    xsmall: [null, "480px"],
  });

  // Hack: Enable IE flexbox workarounds.
  if (browser.name == "ie") $body.addClass("is-ie");

  // Play initial animations on page load.
  $window.on("load", function () {
    window.setTimeout(function () {
      $body.removeClass("is-preload");
    }, 100);
  });

  // Forms.

  // Hack: Activate non-input submits.
  $("form").on("click", ".submit", function (event) {
    // Stop propagation, default.
    event.stopPropagation();
    event.preventDefault();

    // Submit form.
    $(this).parents("form").submit();
  });

  // Sidebar.
  if ($sidebar.length > 0) {
    var $sidebar_a = $sidebar.find("a");

    $sidebar_a
      .addClass("scrolly")
      .on("click", function () {
        var $this = $(this);

        // External link? Bail.
        if ($this.attr("href").charAt(0) != "#") return;

        // Deactivate all links.
        $sidebar_a.removeClass("active");

        // Activate link *and* lock it (so Scrollex doesn't try to activate other links as we're scrolling to this one's section).
        $this.addClass("active").addClass("active-locked");
      })
      .each(function () {
        var $this = $(this),
          id = $this.attr("href"),
          $section = $(id);

        // No section for this link? Bail.
        if ($section.length < 1) return;

        // Scrollex.
        $section.scrollex({
          mode: "middle",
          top: "-20vh",
          bottom: "-20vh",
          initialize: function () {
            // Deactivate section.
            $section.addClass("inactive");
          },
          enter: function () {
            // Activate section.
            $section.removeClass("inactive");

            // No locked links? Deactivate all links and activate this section's one.
            if ($sidebar_a.filter(".active-locked").length == 0) {
              $sidebar_a.removeClass("active");
              $this.addClass("active");
            }

            // Otherwise, if this section's link is the one that's locked, unlock it.
            else if ($this.hasClass("active-locked"))
              $this.removeClass("active-locked");
          },
        });
      });
  }

  // Scrolly.
  $(".scrolly").scrolly({
    speed: 1000,
    offset: function () {
      // If <=large, >small, and sidebar is present, use its height as the offset.
      if (
        breakpoints.active("<=large") &&
        !breakpoints.active("<=small") &&
        $sidebar.length > 0
      )
        return $sidebar.height();

      return 0;
    },
  });

  // Spotlights.
  $(".spotlights > section")
    .scrollex({
      mode: "middle",
      top: "-10vh",
      bottom: "-10vh",
      initialize: function () {
        // Deactivate section.
        $(this).addClass("inactive");
      },
      enter: function () {
        // Activate section.
        $(this).removeClass("inactive");
      },
    })
    .each(function () {
      var $this = $(this),
        $image = $this.find(".image"),
        $img = $image.find("img"),
        x;

      // Assign image.
      $image.css("background-image", "url(" + $img.attr("src") + ")");

      // Set background position.
      if ((x = $img.data("position"))) $image.css("background-position", x);

      // Hide <img>.
      $img.hide();
    });

  // Features.
  $(".features").scrollex({
    mode: "middle",
    top: "-20vh",
    bottom: "-20vh",
    initialize: function () {
      // Deactivate section.
      $(this).addClass("inactive");
    },
    enter: function () {
      // Activate section.
      $(this).removeClass("inactive");
    },
  });
})(jQuery);
