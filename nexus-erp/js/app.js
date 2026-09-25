/* =========================================================
   NEXUS ERP — Global JavaScript Engine & Template Controller
   File: js/app.js
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  /* =======================================================
     THEME CONTROLLER (Dark / Light Mode)
     ======================================================= */

  const savedTheme = localStorage.getItem("nexus_theme") || "light";
  document.documentElement.setAttribute("data-theme", savedTheme);

  // Initialize or inject theme toggle button in topbar
  const topbarRight = document.querySelector(".topbar-right");
  if (topbarRight) {
    let themeBtn = document.querySelector(".theme-toggle-btn");
    if (!themeBtn) {
      themeBtn = document.createElement("button");
      themeBtn.className = "icon-button theme-toggle-btn";
      themeBtn.type = "button";
      themeBtn.setAttribute("title", "Toggle Dark/Light Mode");
      themeBtn.setAttribute("aria-label", "Toggle Dark/Light Mode");

      // Insert before notification button or profile
      const notifBtn = topbarRight.querySelector(".notification-button");
      if (notifBtn) {
        topbarRight.insertBefore(themeBtn, notifBtn);
      } else {
        topbarRight.prepend(themeBtn);
      }
    }

    const updateThemeIcon = (theme) => {
      themeBtn.innerHTML = theme === "dark" ? "☀️" : "🌙";
      themeBtn.setAttribute("title", theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode");
    };

    updateThemeIcon(savedTheme);

    themeBtn.addEventListener("click", () => {
      const currentTheme = document.documentElement.getAttribute("data-theme") || "light";
      const newTheme = currentTheme === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", newTheme);
      localStorage.setItem("nexus_theme", newTheme);
      updateThemeIcon(newTheme);
      showToast("Theme Updated", `Switched to ${newTheme === "dark" ? "Dark" : "Light"} mode.`, "info");
    });
  }


  /* =======================================================
     MOBILE SIDEBAR
     ======================================================= */

  const mobileMenu = document.getElementById("mobileMenu");
  const sidebar = document.querySelector(".sidebar");

  if (mobileMenu && sidebar) {
    mobileMenu.addEventListener("click", (e) => {
      e.stopPropagation();
      sidebar.classList.toggle("open");
    });

    document.addEventListener("click", (event) => {
      if (
        window.innerWidth <= 900 &&
        sidebar.classList.contains("open") &&
        !sidebar.contains(event.target) &&
        !mobileMenu.contains(event.target)
      ) {
        sidebar.classList.remove("open");
      }
    });
  }


  /* =======================================================
     ACTIVE SIDEBAR NAVIGATION
     ======================================================= */

  const currentPage = window.location.pathname.split("/").pop() || "index.html";

  document.querySelectorAll(".nav-item").forEach((item) => {
    const href = item.getAttribute("href");
    if (!href) return;

    const targetPage = href.split("/").pop();

    if (
      targetPage === currentPage ||
      (currentPage === "" && targetPage === "index.html") ||
      (currentPage === "index.html" && targetPage === "index.html")
    ) {
      item.classList.add("active");
    }

    item.addEventListener("click", () => {
      document.querySelectorAll(".nav-item").forEach((nav) => {
        nav.classList.remove("active");
      });
      item.classList.add("active");

      if (window.innerWidth <= 900 && sidebar) {
        sidebar.classList.remove("open");
      }
    });
  });


  /* =======================================================
     GLOBAL SEARCH
     ======================================================= */

  const globalSearch = document.getElementById("globalSearch");

  if (globalSearch) {
    globalSearch.addEventListener("input", () => {
      const query = globalSearch.value.toLowerCase().trim();

      const searchableRows = document.querySelectorAll("tbody tr");
      searchableRows.forEach((row) => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(query) ? "" : "none";
      });

      const searchableCards = document.querySelectorAll(
        ".product-alert, .integration-card, .activity-item"
      );
      searchableCards.forEach((card) => {
        const text = card.textContent.toLowerCase();
        card.style.display = text.includes(query) ? "" : "none";
      });
    });

    // Keyboard shortcut (⌘ K / Ctrl + K)
    document.addEventListener("keydown", (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        globalSearch.focus();
        globalSearch.select();
      }
    });
  }


  /* =======================================================
     TABLE SEARCH
     ======================================================= */

  document.querySelectorAll(".table-search input").forEach((input) => {
    input.addEventListener("input", () => {
      const query = input.value.toLowerCase().trim();
      const tableCard = input.closest(
        ".dashboard-card, .transactions-card, .activity-card, .low-stock-card"
      ) || input.closest("section");

      if (!tableCard) return;

      const rows = tableCard.querySelectorAll("tbody tr");
      rows.forEach((row) => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(query) ? "" : "none";
      });
    });
  });


  /* =======================================================
     TABLE FILTERS
     ======================================================= */

  document.querySelectorAll(".table-filters").forEach((filterBar) => {
    const searchInput = filterBar.querySelector(".table-search input");
    const selects = filterBar.querySelectorAll(".filter-select");
    const parentContainer = filterBar.parentElement;
    const table = parentContainer.querySelector("table");

    if (!table) return;

    const rows = table.querySelectorAll("tbody tr");

    function applyFilters() {
      const searchValue = searchInput ? searchInput.value.toLowerCase().trim() : "";

      rows.forEach((row) => {
        let visible = true;
        const rowText = row.textContent.toLowerCase();

        if (searchValue && !rowText.includes(searchValue)) {
          visible = false;
        }

        selects.forEach((select) => {
          const value = select.value.toLowerCase().trim();
          if (
            value &&
            !value.startsWith("all")
          ) {
            const selectedText = select.options[select.selectedIndex].textContent.toLowerCase();
            if (selectedText && !rowText.includes(selectedText)) {
              visible = false;
            }
          }
        });

        row.style.display = visible ? "" : "none";
      });
    }

    if (searchInput) {
      searchInput.addEventListener("input", applyFilters);
    }

    selects.forEach((select) => {
      select.addEventListener("change", applyFilters);
    });
  });


  /* =======================================================
     PAGINATION
     ======================================================= */

  document.querySelectorAll(".pagination").forEach((pagination) => {
    const buttons = pagination.querySelectorAll("button");

    buttons.forEach((button) => {
      button.addEventListener("click", () => {
        const text = button.textContent.trim();
        if (text === "‹" || text === "›" || text === "←" || text === "→" || text === "...") {
          return;
        }

        buttons.forEach((btn) => btn.classList.remove("active"));
        button.classList.add("active");
        showToast("Page Changed", `Loaded page ${text} results`, "info");
      });
    });
  });


  /* =======================================================
     PERIOD SELECTORS (BUG FIX: Preserves chart visual line)
     ======================================================= */

  document.querySelectorAll(".period-select").forEach((select) => {
    select.addEventListener("change", () => {
      const card = select.closest(".dashboard-card");
      if (!card) return;

      const chartLine = card.querySelector(".chart-line");
      const selectedOption = select.options[select.selectedIndex].text;

      // Animate chart line transformation dynamically without wiping inner DOM
      if (chartLine) {
        chartLine.style.transition = "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease";
        chartLine.style.opacity = "0.4";
        setTimeout(() => {
          const skews = ["-8deg", "-12deg", "-6deg", "-10deg"];
          const randomSkew = skews[select.selectedIndex % skews.length];
          chartLine.style.transform = `skewY(${randomSkew})`;
          chartLine.style.opacity = "1";
        }, 150);
      }

      showToast("Chart Updated", `Now displaying data for: ${selectedOption}`, "info");
    });
  });


  /* =======================================================
     SETTINGS MENU (BUG FIX: Handles both data-target & href)
     ======================================================= */

  const settingsItems = document.querySelectorAll(".settings-menu-item");
  const settingsSections = document.querySelectorAll(".settings-section");

  if (settingsItems.length) {
    settingsItems.forEach((item) => {
      item.addEventListener("click", (e) => {
        const href = item.getAttribute("href");
        if (href && href.startsWith("#")) {
          e.preventDefault();
        }

        settingsItems.forEach((button) => {
          button.classList.remove("active");
        });
        item.classList.add("active");

        const target = item.dataset.target || (href ? href.replace("#", "") : null);
        if (!target) return;

        const targetEl = document.getElementById(target);
        if (targetEl) {
          targetEl.scrollIntoView({
            behavior: "smooth",
            block: "start"
          });
        }
      });
    });
  }


  /* =======================================================
     TOGGLE SWITCHES
     ======================================================= */

  document.querySelectorAll(".toggle input").forEach((toggle) => {
    toggle.addEventListener("change", () => {
      const option = toggle.closest(".setting-option");
      if (!option) return;

      const status = option.querySelector(".toggle-status");
      if (status) {
        status.textContent = toggle.checked ? "Enabled" : "Disabled";
      }

      showToast(
        "Setting Updated",
        `Feature has been ${toggle.checked ? "enabled" : "disabled"}.`,
        "info"
      );
    });
  });


  /* =======================================================
     SAVE SETTINGS FEEDBACK
     ======================================================= */

  const saveButton = document.querySelector(".page-actions .primary-button");
  if (saveButton && document.querySelector(".settings-layout")) {
    saveButton.addEventListener("click", () => {
      saveButton.textContent = "✓ Saved";
      saveButton.disabled = true;

      showToast("Configuration Saved", "Your workspace settings have been updated.", "success");

      setTimeout(() => {
        saveButton.textContent = "Save Changes";
        saveButton.disabled = false;
      }, 1800);
    });
  }

  const cancelButton = document.querySelector(".page-actions .secondary-button");
  if (cancelButton && document.querySelector(".settings-layout")) {
    cancelButton.addEventListener("click", () => {
      const confirmed = window.confirm("Discard unsaved changes?");
      if (confirmed) {
        window.location.reload();
      }
    });
  }


  /* =======================================================
     TOAST NOTIFICATION ENGINE
     ======================================================= */

  let toastContainer = document.querySelector(".erp-toast-container");
  if (!toastContainer) {
    toastContainer = document.createElement("div");
    toastContainer.className = "erp-toast-container";
    document.body.appendChild(toastContainer);
  }

  window.showToast = function (title, message, type = "success") {
    const toast = document.createElement("div");
    toast.className = `erp-toast toast-${type}`;

    const icon = type === "success" ? "✓" : type === "danger" ? "✕" : "ℹ";

    toast.innerHTML = `
      <span class="erp-toast-icon">${icon}</span>
      <div class="erp-toast-message">
        <strong>${title}</strong>
        <span>${message}</span>
      </div>
    `;

    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transform = "translateX(50px)";
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  };


  /* =======================================================
     TABLE ACTION DROPDOWN MENUS (Replaces native alert)
     ======================================================= */

  let currentOpenDropdown = null;

  const closeDropdown = () => {
    if (currentOpenDropdown) {
      currentOpenDropdown.remove();
      currentOpenDropdown = null;
    }
  };

  document.addEventListener("click", (e) => {
    if (currentOpenDropdown && !currentOpenDropdown.contains(e.target) && !e.target.closest(".table-action")) {
      closeDropdown();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeDropdown();
      closeModal();
    }
  });

  document.querySelectorAll(".table-action").forEach((button) => {
    button.addEventListener("click", (e) => {
      e.stopPropagation();
      closeDropdown();

      const row = button.closest("tr");
      if (!row) return;

      const recordId = row.cells[0] ? row.cells[0].textContent.trim() : "Record";

      const dropdown = document.createElement("div");
      dropdown.className = "table-action-menu";

      dropdown.innerHTML = `
        <button type="button" class="dropdown-item view-action">👁️ View Details</button>
        <button type="button" class="dropdown-item edit-action">✏️ Edit Record</button>
        <button type="button" class="dropdown-item copy-action">⎘ Duplicate</button>
        <div class="dropdown-divider"></div>
        <button type="button" class="dropdown-item danger-item delete-action">🗑️ Delete</button>
      `;

      // Position near button
      const rect = button.getBoundingClientRect();
      dropdown.style.top = `${rect.bottom + window.scrollY + 4}px`;
      dropdown.style.left = `${Math.max(10, rect.right + window.scrollX - 160)}px`;

      document.body.appendChild(dropdown);
      currentOpenDropdown = dropdown;

      dropdown.querySelector(".view-action").addEventListener("click", () => {
        closeDropdown();
        showToast("Record Details", `Inspecting full details for ${recordId}`, "info");
      });

      dropdown.querySelector(".edit-action").addEventListener("click", () => {
        closeDropdown();
        openContextModal("Edit Record", `Update details for ${recordId}`, row);
      });

      dropdown.querySelector(".copy-action").addEventListener("click", () => {
        closeDropdown();
        const clone = row.cloneNode(true);
        row.parentNode.insertBefore(clone, row.nextSibling);
        clone.classList.add("new-row-highlight");
        // Re-bind action button on duplicate
        const newBtn = clone.querySelector(".table-action");
        if (newBtn) {
          newBtn.addEventListener("click", (ev) => {
            ev.stopPropagation();
            button.click();
          });
        }
        showToast("Record Duplicated", `Created a copy of ${recordId}`, "success");
      });

      dropdown.querySelector(".delete-action").addEventListener("click", () => {
        closeDropdown();
        const confirmed = window.confirm(`Are you sure you want to delete ${recordId}?`);
        if (confirmed) {
          row.style.transition = "all 0.3s ease";
          row.style.opacity = "0";
          setTimeout(() => {
            row.remove();
            showToast("Record Deleted", `${recordId} was successfully removed.`, "danger");
          }, 300);
        }
      });
    });
  });


  /* =======================================================
     USER PROFILE DROPDOWNS (Topbar & Sidebar Footer)
     ======================================================= */

  const isSubpage = window.location.pathname.includes("/pages/");
  const prefix = isSubpage ? "" : "pages/";

  function getProfileMenuMarkup() {
    return `
      <div style="padding: 8px 12px; border-bottom: 1px solid var(--border-light); margin-bottom: 4px;">
        <strong style="display:block; font-size:12px; color:var(--text-primary);">John Doe</strong>
        <span style="font-size:10px; color:var(--text-secondary);">john.doe@nexuserp.com</span>
      </div>
      <a href="${prefix}settings.html#profile" class="dropdown-item">♙ My Profile</a>
      <a href="${prefix}settings.html#general" class="dropdown-item">⚙ Organization Settings</a>
      <a href="${prefix}settings.html#security" class="dropdown-item">🔒 Security & 2FA</a>
      <div class="dropdown-divider"></div>
      <a href="${prefix}login.html" class="dropdown-item danger-item">🚪 Sign Out</a>
    `;
  }

  // 1. Topbar Profile Pill
  const profilePill = document.querySelector(".profile");
  if (profilePill) {
    let profileMenu = null;

    profilePill.addEventListener("click", (e) => {
      e.stopPropagation();
      closeDropdown();

      if (profileMenu) {
        profileMenu.remove();
        profileMenu = null;
        return;
      }

      profileMenu = document.createElement("div");
      profileMenu.className = "profile-dropdown";
      profileMenu.innerHTML = getProfileMenuMarkup();

      profilePill.appendChild(profileMenu);
      currentOpenDropdown = profileMenu;
    });
  }

  // 2. Sidebar Bottom Account Mini & 3-Dot Button
  const sidebarUser = document.querySelector(".user-mini, .sidebar-profile");
  if (sidebarUser) {
    let sidebarMenu = null;

    const toggleSidebarUserMenu = (e) => {
      e.stopPropagation();
      closeDropdown();

      if (sidebarMenu) {
        sidebarMenu.remove();
        sidebarMenu = null;
        return;
      }

      sidebarMenu = document.createElement("div");
      sidebarMenu.className = "profile-dropdown";
      sidebarMenu.style.top = "auto";
      sidebarMenu.style.bottom = "calc(100% + 8px)";
      sidebarMenu.style.left = "0";
      sidebarMenu.style.right = "0";
      sidebarMenu.style.width = "100%";
      sidebarMenu.style.boxSizing = "border-box";
      sidebarMenu.innerHTML = getProfileMenuMarkup();

      sidebarUser.appendChild(sidebarMenu);
      currentOpenDropdown = sidebarMenu;
    };

    const threeDotBtn = sidebarUser.querySelector(".user-menu");
    if (threeDotBtn) {
      threeDotBtn.addEventListener("click", toggleSidebarUserMenu);
    }
    sidebarUser.addEventListener("click", (e) => {
      if (!e.target.closest(".user-menu") && !e.target.closest(".profile-dropdown")) {
        toggleSidebarUserMenu(e);
      }
    });
  }


  /* =======================================================
     INTERACTIVE CRUD MODAL SYSTEM
     ======================================================= */

  let activeModalOverlay = null;

  function closeModal() {
    if (activeModalOverlay) {
      activeModalOverlay.classList.remove("open");
      setTimeout(() => {
        activeModalOverlay.remove();
        activeModalOverlay = null;
      }, 200);
    }
  }

  function openContextModal(title, subtitle, editingRow = null) {
    closeModal();

    // Determine current page context
    const pathname = window.location.pathname.toLowerCase();
    let fieldsHtml = "";
    let submitLabel = editingRow ? "Save Changes" : "Create Record";

    if (pathname.includes("customer")) {
      fieldsHtml = `
        <div class="modal-grid-2">
          <div class="form-group">
            <label>Customer Name</label>
            <input type="text" id="m_name" placeholder="Acme Corp / Sarah Jenkins" required>
          </div>
          <div class="form-group">
            <label>Email Address</label>
            <input type="email" id="m_email" placeholder="contact@acme.com" required>
          </div>
        </div>
        <div class="modal-grid-2">
          <div class="form-group">
            <label>Phone Number</label>
            <input type="text" id="m_phone" placeholder="+971 50 123 4567">
          </div>
          <div class="form-group">
            <label>Customer Segment</label>
            <select id="m_segment">
              <option>VIP Enterprise</option>
              <option selected>Regular Customer</option>
              <option>New Customer</option>
            </select>
          </div>
        </div>
        <div class="form-group">
          <label>Company / Notes</label>
          <input type="text" id="m_company" placeholder="Company legal entity or region">
        </div>
      `;
      submitLabel = editingRow ? "Update Customer" : "Add Customer";
    } else if (pathname.includes("product")) {
      fieldsHtml = `
        <div class="modal-grid-2">
          <div class="form-group">
            <label>Product Name</label>
            <input type="text" id="m_name" placeholder="Wireless Mechanical Keyboard" required>
          </div>
          <div class="form-group">
            <label>SKU / Item Code</label>
            <input type="text" id="m_sku" placeholder="PRD-9021" required>
          </div>
        </div>
        <div class="modal-grid-2">
          <div class="form-group">
            <label>Category</label>
            <select id="m_category">
              <option>Electronics</option>
              <option>Office Supplies</option>
              <option>Furniture</option>
              <option>Accessories</option>
            </select>
          </div>
          <div class="form-group">
            <label>Unit Price (AED)</label>
            <input type="number" id="m_price" placeholder="299.00" step="0.01" required>
          </div>
        </div>
        <div class="modal-grid-2">
          <div class="form-group">
            <label>Initial Stock</label>
            <input type="number" id="m_stock" placeholder="50" required>
          </div>
          <div class="form-group">
            <label>Status</label>
            <select id="m_status">
              <option>In Stock</option>
              <option>Low Stock</option>
              <option>Out of Stock</option>
            </select>
          </div>
        </div>
      `;
      submitLabel = editingRow ? "Update Product" : "Save Product";
    } else if (pathname.includes("sale")) {
      fieldsHtml = `
        <div class="modal-grid-2">
          <div class="form-group">
            <label>Customer Name</label>
            <input type="text" id="m_customer" placeholder="Alpha Logistics" required>
          </div>
          <div class="form-group">
            <label>Order Amount (AED)</label>
            <input type="number" id="m_amount" placeholder="4500.00" step="0.01" required>
          </div>
        </div>
        <div class="modal-grid-2">
          <div class="form-group">
            <label>Payment Method</label>
            <select id="m_payment">
              <option>Bank Transfer</option>
              <option>Credit Card</option>
              <option>Cash on Delivery</option>
            </select>
          </div>
          <div class="form-group">
            <label>Order Status</label>
            <select id="m_status">
              <option>Completed</option>
              <option>Processing</option>
              <option>Pending</option>
            </select>
          </div>
        </div>
      `;
      submitLabel = editingRow ? "Update Order" : "Generate Order";
    } else {
      // General quick create
      fieldsHtml = `
        <div class="form-group">
          <label>Title / Identifier</label>
          <input type="text" id="m_title" placeholder="New Record or Activity" required>
        </div>
        <div class="modal-grid-2">
          <div class="form-group">
            <label>Category / Type</label>
            <select id="m_type">
              <option>Sales & Invoicing</option>
              <option>Inventory & Stock</option>
              <option>Purchasing Order</option>
              <option>HR & Staff</option>
              <option>Expense / Finance</option>
            </select>
          </div>
          <div class="form-group">
            <label>Value / Amount</label>
            <input type="text" id="m_val" placeholder="AED 1,250">
          </div>
        </div>
        <div class="form-group">
          <label>Description / Notes</label>
          <textarea id="m_notes" placeholder="Additional details or reference IDs..." rows="2"></textarea>
        </div>
      `;
      submitLabel = "Save Entry";
    }

    const overlay = document.createElement("div");
    overlay.className = "erp-modal-overlay";
    overlay.innerHTML = `
      <div class="erp-modal">
        <div class="erp-modal-header">
          <div>
            <h3>${title}</h3>
            <p style="font-size:11px; color:var(--text-secondary); margin-top:2px;">${subtitle}</p>
          </div>
          <button type="button" class="erp-modal-close" aria-label="Close">✕</button>
        </div>
        <form class="erp-modal-body" id="modalForm">
          ${fieldsHtml}
        </form>
        <div class="erp-modal-footer">
          <button type="button" class="secondary-button cancel-modal-btn">Cancel</button>
          <button type="submit" form="modalForm" class="primary-button">${submitLabel}</button>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);
    activeModalOverlay = overlay;

    // Trigger animation
    requestAnimationFrame(() => overlay.classList.add("open"));

    // Event listeners
    overlay.querySelector(".erp-modal-close").addEventListener("click", closeModal);
    overlay.querySelector(".cancel-modal-btn").addEventListener("click", closeModal);
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) closeModal();
    });

    // Form submission
    const form = overlay.querySelector("#modalForm");
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const tableBody = document.querySelector("table tbody");

      if (tableBody && !editingRow) {
        // Prepend new mock row into table
        const newRow = document.createElement("tr");
        newRow.className = "new-row-highlight";

        const today = new Date().toISOString().split("T")[0];
        const randomCode = Math.floor(1000 + Math.random() * 9000);

        if (pathname.includes("customer")) {
          const name = document.getElementById("m_name").value;
          const email = document.getElementById("m_email").value;
          const phone = document.getElementById("m_phone").value || "+971 50 000 0000";
          const segment = document.getElementById("m_segment").value;
          const company = document.getElementById("m_company").value || "Direct";

          newRow.innerHTML = `
            <td><input type="checkbox"></td>
            <td><strong>#CST-${randomCode}</strong></td>
            <td><strong>${name}</strong></td>
            <td>${email}</td>
            <td>${phone}</td>
            <td>${company}</td>
            <td>1 order</td>
            <td>AED 0.00</td>
            <td><span class="status-badge active">${segment}</span></td>
            <td><button class="table-action">⋯</button></td>
          `;
        } else if (pathname.includes("product")) {
          const name = document.getElementById("m_name").value;
          const sku = document.getElementById("m_sku").value;
          const cat = document.getElementById("m_category").value;
          const price = parseFloat(document.getElementById("m_price").value || 0).toFixed(2);
          const stock = document.getElementById("m_stock").value;
          const status = document.getElementById("m_status").value;

          newRow.innerHTML = `
            <td><input type="checkbox"></td>
            <td><strong>${sku}</strong></td>
            <td><strong>${name}</strong></td>
            <td>${cat}</td>
            <td>AED ${price}</td>
            <td>${stock} in stock</td>
            <td>35%</td>
            <td><span class="status-badge ${status.toLowerCase().includes('in') ? 'active' : 'warning'}">${status}</span></td>
            <td><button class="table-action">⋯</button></td>
          `;
        } else {
          // Generic prepended row
          const titleVal = (document.getElementById("m_title") || document.getElementById("m_customer") || {}).value || "Item";
          newRow.innerHTML = `
            <td><strong>#REC-${randomCode}</strong></td>
            <td><strong>${titleVal}</strong></td>
            <td>${today}</td>
            <td>AED 1,250.00</td>
            <td><span class="status-badge active">Active</span></td>
            <td><button class="table-action">⋯</button></td>
          `;
        }

        tableBody.prepend(newRow);

        // Reconnect action button
        const actionBtn = newRow.querySelector(".table-action");
        if (actionBtn) {
          actionBtn.addEventListener("click", (ev) => {
            ev.stopPropagation();
            alert(`Action menu for newly created record.`);
          });
        }
      }

      closeModal();
      showToast(
        editingRow ? "Record Updated" : "Record Created",
        `${title} was successfully processed.`,
        "success"
      );
    });
  }

  // Bind all primary create buttons to modal
  document.querySelectorAll(".page-actions .primary-button, .welcome-section .primary-button").forEach((btn) => {
    const text = btn.textContent.trim();
    if (text.startsWith("+") || text.toLowerCase().includes("create") || text.toLowerCase().includes("add") || text.toLowerCase().includes("new")) {
      btn.addEventListener("click", (e) => {
        // Only trigger modal if not on settings page
        if (!document.querySelector(".settings-layout")) {
          e.preventDefault();
          openContextModal(text.replace("+", "").trim(), "Enter the details below to add a new record to your ERP system.");
        }
      });
    }
  });


  /* =======================================================
     PASSWORD VISIBILITY TOGGLE
     ======================================================= */

  document.querySelectorAll('input[type="password"]').forEach((passwordInput) => {
    const wrapper = passwordInput.parentElement;
    if (!wrapper || wrapper.querySelector(".password-toggle")) return;

    const button = document.createElement("button");
    button.type = "button";
    button.className = "password-toggle";
    button.textContent = "Show";
    button.style.marginTop = "5px";
    button.style.border = "none";
    button.style.background = "none";
    button.style.color = "var(--primary)";
    button.style.fontSize = "11px";
    button.style.fontWeight = "600";
    button.style.padding = "0";
    button.style.cursor = "pointer";

    button.addEventListener("click", () => {
      const visible = passwordInput.type === "text";
      passwordInput.type = visible ? "password" : "text";
      button.textContent = visible ? "Show" : "Hide";
    });

    wrapper.appendChild(button);
  });


  /* =======================================================
     CHECK ALL / SELECTED ROWS
     ======================================================= */

  const selectAll = document.querySelector('input[type="checkbox"][data-select-all]');
  if (selectAll) {
    selectAll.addEventListener("change", () => {
      const table = selectAll.closest("table");
      if (!table) return;

      table.querySelectorAll('tbody input[type="checkbox"]').forEach((checkbox) => {
        checkbox.checked = selectAll.checked;
      });

      const count = table.querySelectorAll('tbody input[type="checkbox"]:checked').length;
      if (count > 0) {
        showToast("Selection Updated", `${count} items currently selected`, "info");
      }
    });
  }


  /* =======================================================
     BUTTON FEEDBACK (Export, Print, Download)
     ======================================================= */

  document.querySelectorAll(".primary-button, .secondary-button").forEach((button) => {
    if (button.classList.contains("table-action") || button.closest(".settings-layout")) {
      return;
    }

    button.addEventListener("click", () => {
      const text = button.textContent.trim().toLowerCase();
      if (button.tagName === "A" || button.hasAttribute("data-action")) return;

      if (text.includes("export") || text.includes("download")) {
        showToast("Export Initiated", "Generating spreadsheet report (.csv / .xlsx)...", "info");
      } else if (text.includes("import")) {
        showToast("Import Dialog", "Ready to parse CSV spreadsheet records.", "info");
      } else if (text.includes("schedule")) {
        showToast("Report Scheduled", "Automated email dispatch configured for Monday 09:00 AM.", "success");
      }
    });
  });


  /* =======================================================
     AUTO CLOSE SIDEBAR ON RESIZE
     ======================================================= */

  window.addEventListener("resize", () => {
    if (window.innerWidth > 900 && sidebar) {
      sidebar.classList.remove("open");
    }
  });


  /* =======================================================
     CONSOLE BADGE
     ======================================================= */

  console.log(
    "%cNEXUS ERP TEMPLATE",
    "background: #2563eb; color: #fff; font-size: 14px; font-weight: 700; padding: 4px 8px; border-radius: 4px;"
  );
  console.log("NEXUS ERP template runtime active. Dark mode and interactive CRUD engine enabled.");

});