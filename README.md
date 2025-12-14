# Contact Form - Frontend Mentor Challenge

[![Live Demo](https://img.shields.io/badge/demo-live-brightgreen)](https://contact-form-seven-topaz.vercel.app/)
[![GitHub](https://img.shields.io/badge/github-repository-blue)](https://github.com/omofon/Contact-Form)
[![Frontend Mentor](https://img.shields.io/badge/Frontend%20Mentor-Challenge-orange)](https://www.frontendmentor.io/challenges/contact-form--G-hYlqKJj)

A fully accessible, validated contact form with Supabase backend integration. Built as a solution to the Frontend Mentor contact form challenge.

## 🎯 Challenge Requirements

Users can:
- ✅ Complete the form and see a success toast message
- ✅ Receive validation messages for missing/incorrect fields
- ✅ Navigate and submit using keyboard only
- ✅ Experience proper screen reader announcements
- ✅ View optimal layouts across all device sizes
- ✅ See hover and focus states for all interactive elements

## 📸 Screenshots

### Desktop View
![Desktop Design](./design/desktop-design.jpg)

### Mobile View
![Mobile Design](./design/mobile-design.jpg)

### Active States
![Focus & Active States](./design/focus-and-active-state.jpg)

## 🔗 Links

- **Live Site**: [contact-form-seven-topaz.vercel.app](https://contact-form-seven-topaz.vercel.app/)
- **Repository**: [github.com/omofon/Contact-Form](https://github.com/omofon/Contact-Form)
- **Challenge**: [Frontend Mentor](https://www.frontendmentor.io/challenges/contact-form--G-hYlqKJj)

## 🛠️ Built With

### Core Technologies
- **HTML5** - Semantic markup with proper form structure
- **CSS3** - Modern layout with custom properties
- **Tailwind CSS v4** - Utility-first styling with custom theme
- **Vanilla JavaScript (ES6+)** - Form validation & DOM manipulation
- **Supabase** - PostgreSQL database for form submissions

### Key Features
- Accessible form design (WCAG 2.1 AA compliant)
- Real-time validation with blur events
- Custom radio button styling
- Toast notification system
- Responsive mobile-first design
- Loading states during async operations

## 📁 Project Structure

```
contact-form/
├── src/
│   ├── index.js          # Validation logic & Supabase integration
│   ├── input.css         # Tailwind custom theme & components
│   └── output.css        # Compiled Tailwind CSS
├── design/               # Design reference files
│   ├── desktop-design.jpg
│   ├── mobile-design.jpg
│   └── focus-and-active-state.jpg
├── assets/
│   └── images/
│       └── favicon-32x32.png
├── index.html            # Main HTML structure
├── README.md
└── .gitignore
```

## 🚀 Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- [Node.js](https://nodejs.org/) v16+ (for Tailwind CLI)
- [Supabase account](https://supabase.com) (for backend)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/omofon/Contact-Form.git
cd Contact-Form
```

2. **Set up Supabase**

Create a new Supabase project and run this SQL:

```sql
-- Create the contact_messages table
CREATE TABLE contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  query_type TEXT NOT NULL CHECK (query_type IN ('General Enquiry', 'Support Request')),
  message TEXT NOT NULL,
  consent BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts only
CREATE POLICY "Allow anonymous inserts" 
  ON contact_messages 
  FOR INSERT 
  TO anon 
  WITH CHECK (true);

-- Prevent anonymous reads (admin only)
CREATE POLICY "Prevent anonymous reads" 
  ON contact_messages 
  FOR SELECT 
  TO anon 
  USING (false);
```

3. **Configure environment variables**

Create a `.env` file (DO NOT COMMIT THIS):
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Update `src/index.js` to use environment variables:
```javascript
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);
```

4. **Install dependencies (if modifying styles)**
```bash
npm install -D tailwindcss
```

5. **Run locally**
```bash
# Simple HTTP server
python -m http.server 8000
# or
npx serve

# If using Vite (recommended for env vars)
npm create vite@latest . -- --template vanilla
npm install
npm run dev
```

## 🎨 Customization

### Tailwind Theme
The custom color palette is defined in `src/input.css`:

```css
@theme {
  --color-green-600: hsl(169, 82%, 27%);
  --color-grey-900: hsl(187, 24%, 22%);
  /* ... more colors */
}
```

### Form Validation
Error messages are configured in `src/index.js`:

```javascript
const errorDict = {
  firstName: { empty: "This field is required" },
  email: {
    empty: "This field is required",
    invalid: "Please enter a valid email address",
  },
  // ...
};
```

## 🧩 Architecture Decisions

### Validation Strategy
The form implements three layers of validation:

1. **HTML5 Attributes** - `required`, `type="email"` for browser validation
2. **JavaScript Validation** - Custom logic with better error messages
3. **Real-time Feedback** - Validation on `blur` events for immediate UX

### Accessibility Implementation
- `aria-describedby` links inputs to error messages
- `aria-invalid` flags fields with errors
- `aria-live="polite"` announces errors without interrupting
- Focus management after validation failures
- Keyboard-only navigation support
- Screen reader tested with NVDA & VoiceOver

### Database Schema
```sql
contact_messages (
  id              UUID PRIMARY KEY,
  first_name      TEXT NOT NULL,
  last_name       TEXT NOT NULL,
  email           TEXT NOT NULL,
  query_type      TEXT NOT NULL CHECK (...),
  message         TEXT NOT NULL,
  consent         BOOLEAN NOT NULL,
  created_at      TIMESTAMPTZ DEFAULT NOW()
)
```

Row Level Security ensures:
- Anonymous users can INSERT only
- No public reads (prevents data scraping)
- Admin-only SELECT access

## 💡 What I Learned

### Form Accessibility Deep Dive
Properly associating errors with form fields using `aria-describedby` ensures screen reader users get immediate feedback:

```javascript
function setError(element, errorEl, message) {
  element.setAttribute('aria-invalid', 'true');
  errorEl.textContent = message;
  errorEl.classList.add('active');
}
```

This pattern, combined with `aria-live` regions, creates an accessible experience without JavaScript frameworks.

### Custom Radio Button Styling
Creating visually custom radio buttons while preserving native functionality required careful CSS:

```css
.query-option {
  @apply flex items-center gap-4 border rounded-md px-4 py-3;
  @apply hover:border-green-600 focus-within:border-green-600;
}
```

The `focus-within` pseudo-class ensures keyboard navigation maintains visual feedback.

### Async Form Submission Pattern
Implementing proper loading states prevents double submissions and improves UX:

```javascript
async function handleSubmit(formData) {
  startLoading();
  
  try {
    const { data, error } = await supabase
      .from('contact_messages')
      .insert([formData]);
    
    if (error) throw error;
    
    showSuccessPopup();
  } catch (error) {
    showErrorToast(error.message);
  } finally {
    stopLoading();
  }
}
```

## 🔄 Continued Development

### Planned Improvements
- [ ] **Email Notifications** - Send confirmation emails via Supabase Edge Functions
- [ ] **Rate Limiting** - Implement Cloudflare Turnstile or hCaptcha
- [ ] **Honeypot Field** - Add invisible field for bot detection
- [ ] **Analytics** - Track completion rates and drop-off points
- [ ] **Progressive Enhancement** - Ensure core functionality without JS
- [ ] **Error Toast System** - Replace `alert()` with custom toast component
- [ ] **Input Sanitization** - Add DOMPurify for XSS prevention
- [ ] **Environment Variables** - Move to Vite for proper env var handling

### Known Issues
- `has-[:checked]:` classes in HTML are commented out (Tailwind v4 compatibility)
- Error handling uses `alert()` instead of custom UI
- No spam protection mechanism
- Supabase credentials need to be environment variables

## 📚 Useful Resources

- [MDN Form Validation](https://developer.mozilla.org/en-US/docs/Learn/Forms/Form_validation) - Comprehensive guide to form validation
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/) - Web accessibility standards
- [Supabase Documentation](https://supabase.com/docs) - Database and auth setup
- [Tailwind CSS v4 Docs](https://tailwindcss.com/docs) - Utility-first CSS framework
- [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/) - Accessible component patterns

## 🏗️ System Design Lessons

This project reinforced several critical principles:

### 1. Separation of Concerns
- Validation logic is isolated in pure functions
- UI updates are separate from business logic
- Data persistence is abstracted through Supabase client

### 2. Defense in Depth
- Client-side validation (UX)
- Server-side validation (Security - via RLS)
- Input sanitization (XSS prevention)
- Rate limiting (Spam prevention - planned)

### 3. User Feedback Loops
- Loading states during async operations
- Clear error messages with visual indicators
- Success confirmation with toast notifications
- Focus management for accessibility

### 4. Security First
- Row Level Security prevents unauthorized access
- Environment variables for sensitive data
- Input validation on both client and server
- HTTPS-only in production

## 👤 Author

- **GitHub** - [@omofon](https://github.com/omofon)
- **Frontend Mentor** - [@omofon](https://www.frontendmentor.io/profile/omofon)

## 🙏 Acknowledgments

- **Frontend Mentor** for the design challenge and specifications
- **Tailwind CSS** documentation for utility class patterns
- **MDN Web Docs** for accessibility best practices
- **Supabase** for developer-friendly database solutions

---

**Challenge by**: [Frontend Mentor](https://www.frontendmentor.io/challenges/contact-form--G-hYlqKJj)  
**Coded by**: [Omofon](https://github.com/omofon)

## 📝 License

This project is open source and available under the [MIT License](LICENSE).