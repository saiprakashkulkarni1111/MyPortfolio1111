import { 
  PERSONAL_INFO, 
  SOCIAL_LINKS, 
  PUBLICATION_DATA, 
  PROJECTS_DATA, 
  SKILL_CATEGORIES, 
  EDUCATION_DATA, 
  QUALIFICATIONS_DATA, 
  LANGUAGES_DATA 
} from '../data/portfolioData';

/**
 * Generates an ATS-compliant, high-contrast, print-ready HTML document for Saiprakash Kulkarni's resume.
 */
export function generateResumeHtml(): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Saiprakash_Kulkarni_Resume</title>
  <style>
    @page {
      margin: 12mm;
      size: A4 portrait;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      color: #111827;
      background: #ffffff;
      margin: 0;
      padding: 24px;
      font-size: 13px;
      line-height: 1.45;
    }
    .header {
      text-align: center;
      border-bottom: 2px solid #0284c7;
      padding-bottom: 12px;
      margin-bottom: 16px;
    }
    h1 {
      margin: 0 0 4px 0;
      font-size: 24px;
      color: #0f172a;
      letter-spacing: 0.5px;
      text-transform: uppercase;
    }
    .tagline {
      font-size: 13px;
      font-weight: 600;
      color: #0284c7;
      margin-bottom: 6px;
    }
    .contact-info {
      font-size: 12px;
      color: #475569;
    }
    .contact-info a {
      color: #0284c7;
      text-decoration: none;
    }
    .section-title {
      font-size: 14px;
      font-weight: 700;
      color: #0f172a;
      text-transform: uppercase;
      border-bottom: 1.5px solid #cbd5e1;
      padding-bottom: 3px;
      margin-top: 14px;
      margin-bottom: 8px;
      letter-spacing: 0.5px;
    }
    .item-header {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      font-weight: 700;
      color: #0f172a;
      margin-bottom: 2px;
    }
    .item-sub {
      display: flex;
      justify-content: space-between;
      color: #0284c7;
      font-size: 12px;
      font-weight: 600;
      margin-bottom: 4px;
    }
    .item-desc {
      color: #334155;
      font-size: 12.5px;
      margin: 0 0 6px 0;
    }
    ul {
      margin: 4px 0 8px 18px;
      padding: 0;
    }
    li {
      margin-bottom: 3px;
      color: #334155;
      font-size: 12.5px;
    }
    .skill-group {
      margin-bottom: 5px;
      font-size: 12.5px;
      color: #334155;
    }
    .skill-title {
      font-weight: 700;
      color: #0f172a;
    }
    .badge {
      display: inline-block;
      font-size: 11px;
      font-weight: 600;
      background: #f1f5f9;
      color: #0f172a;
      border: 1px solid #cbd5e1;
      padding: 1px 6px;
      border-radius: 4px;
      margin-right: 4px;
    }
    @media print {
      body {
        padding: 0;
      }
      .no-print {
        display: none !important;
      }
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>${PERSONAL_INFO.name}</h1>
    <div class="tagline">${PERSONAL_INFO.role} • ${PERSONAL_INFO.subRole}</div>
    <div class="contact-info">
      ${SOCIAL_LINKS.location} | Phone: ${SOCIAL_LINKS.phone} | Email: <a href="mailto:${SOCIAL_LINKS.email}">${SOCIAL_LINKS.email}</a>
      <br>
      LinkedIn: <a href="${SOCIAL_LINKS.linkedin}">${SOCIAL_LINKS.linkedin}</a> | GitHub: <a href="${SOCIAL_LINKS.github}">${SOCIAL_LINKS.github}</a>
    </div>
  </div>

  <div class="section-title">Education</div>
  ${EDUCATION_DATA.map(edu => `
    <div style="margin-bottom: 8px;">
      <div class="item-header">
        <span>${edu.institution}</span>
        <span>${edu.duration}</span>
      </div>
      <div class="item-sub">
        <span>${edu.degree} in ${edu.field} (${edu.score})</span>
        <span>${edu.location}</span>
      </div>
      <ul>
        ${edu.highlights.map(h => `<li>${h}</li>`).join('')}
      </ul>
    </div>
  `).join('')}

  <div class="section-title">Publications & Peer-Reviewed Research</div>
  <div style="margin-bottom: 8px;">
    <div class="item-header">
      <span>${PUBLICATION_DATA.title}</span>
      <span>${PUBLICATION_DATA.date}</span>
    </div>
    <div class="item-sub">
      <span>Role: ${PUBLICATION_DATA.role} (${PUBLICATION_DATA.status})</span>
      <span>${PUBLICATION_DATA.location}</span>
    </div>
    <p class="item-desc"><strong>Abstract:</strong> ${PUBLICATION_DATA.abstract}</p>
    <ul>
      ${PUBLICATION_DATA.highlights.map(h => `<li>${h}</li>`).join('')}
    </ul>
  </div>

  <div class="section-title">Key Engineering Projects</div>
  ${PROJECTS_DATA.map(proj => `
    <div style="margin-bottom: 10px;">
      <div class="item-header">
        <span>${proj.title}</span>
        <span>${proj.timeline}</span>
      </div>
      <div class="item-sub">
        <span>Category: ${proj.category}</span>
        <span>Technologies: ${proj.technologies.join(', ')}</span>
      </div>
      <ul>
        ${proj.bulletPoints.map(b => `<li>${b}</li>`).join('')}
      </ul>
    </div>
  `).join('')}

  <div class="section-title">Technical Proficiencies</div>
  ${SKILL_CATEGORIES.map(cat => `
    <div class="skill-group">
      <span class="skill-title">${cat.category}:</span>
      ${cat.skills.map(s => s.name).join(', ')}
    </div>
  `).join('')}

  <div class="section-title">Certifications & Honors</div>
  <ul>
    ${QUALIFICATIONS_DATA.map(q => `
      <li><strong>${q.title}</strong> — ${q.issuer} (${q.year}): ${q.details}</li>
    `).join('')}
  </ul>

  <div class="section-title">Languages</div>
  <div class="skill-group">
    ${LANGUAGES_DATA.map(l => `<strong>${l.name}</strong> (${l.level} - ${l.note})`).join(' | ')}
  </div>
</body>
</html>`;
}

/**
 * Triggers browser download of the formatted resume document.
 */
export function downloadResumeDoc() {
  const html = generateResumeHtml();
  const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'Saiprakash_Kulkarni_Resume.html';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Opens the print dialog for the resume in a dedicated window or current window.
 */
export function printResumeDoc() {
  const html = generateResumeHtml();
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 250);
  } else {
    // Fallback if popup blocked
    window.print();
  }
}
