import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Button from '../components/Button';
import TextLink from '../components/TextLink';
import Field from '../components/Field';
import usePageTitle from '../hooks/usePageTitle';
import { getProject, PROJECT_TYPE_OPTIONS } from '../data/projects';
import { sendEnquiry, EnquiryError } from '../lib/enquiry';
import './Contact.css';

const FIELD_ORDER = ['name', 'email', 'type', 'message'];
const FIELD_LABELS = { name: 'Name', email: 'Email', type: 'Project type', message: 'Project description' };
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function validateField(field, values) {
  const v = values[field].trim();
  switch (field) {
    case 'name':
      return v ? '' : 'Please enter your name.';
    case 'email':
      if (!v) return 'Please enter your email address.';
      return EMAIL_RE.test(v) ? '' : 'Please enter a valid email address, like name@example.com.';
    case 'type':
      return values.type ? '' : 'Please select a project type.';
    case 'message':
      if (!v) return 'Please tell us a little about your project.';
      return v.length >= 10 ? '' : 'Please add a little more detail (at least 10 characters).';
    default:
      return '';
  }
}

function validateAll(values) {
  const errors = {};
  FIELD_ORDER.forEach((f) => {
    const msg = validateField(f, values);
    if (msg) errors[f] = msg;
  });
  return errors;
}

// Read ?type= and ?project= (set by the "Discuss a Similar Project" buttons) to pre-fill the form.
function initialFromParams(params) {
  const project = getProject(params.get('project') || '');
  const typeParam = params.get('type');
  const typeOk = PROJECT_TYPE_OPTIONS.some((o) => o.value === typeParam);
  return {
    project,
    values: {
      name: '',
      email: '',
      type: typeOk ? typeParam : project ? project.type : '',
      message: project ? `I'm interested in a project similar to ${project.name} (${project.location}). ` : '',
    },
  };
}

function Confirmation({ values, project }) {
  const headingRef = useRef(null);
  usePageTitle('Enquiry received');

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    headingRef.current?.focus();
  }, []);

  const firstName = values.name.trim().split(/\s+/)[0];
  const typeLabel = PROJECT_TYPE_OPTIONS.find((o) => o.value === values.type)?.label;
  const rows = [
    ['Name', values.name.trim()],
    ['Email', values.email.trim()],
    ['Project type', typeLabel],
    ...(project ? [['Related project', project.name]] : []),
  ];

  return (
    <section className="confirmation container" aria-labelledby="confirm-title">
      <div className="confirmation__icon" aria-hidden="true">
        <svg width="28" height="28" viewBox="0 0 28 28">
          <path d="M6 14.5l5.5 5.5L22 9" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <h1 id="confirm-title" ref={headingRef} tabIndex={-1}>
        Thank you, {firstName}.
        <br />
        We&rsquo;ve received your enquiry.
      </h1>
      <p className="lead">The studio will reply to the email address you provided.</p>

      <div className="confirmation__card">
        <h2 className="eyebrow">Your enquiry</h2>
        <dl>
          {rows.map(([k, v]) => (
            <div key={k} className="info-row">
              <dt>{k}</dt>
              <dd>{v}</dd>
            </div>
          ))}
        </dl>
        <p className="confirmation__note">Check the email address above. If it has a typo, send the form again.</p>
      </div>

      <div className="confirmation__actions">
        <Button to="/">Back to Home</Button>
        <Button to="/projects" variant="secondary">View Projects</Button>
      </div>
    </section>
  );
}

function ContactForm() {
  usePageTitle('Contact');
  const [params] = useSearchParams();
  const [{ project, values: initial }] = useState(() => initialFromParams(params));

  const [values, setValues] = useState(initial);
  const [errors, setErrors] = useState({});
  const [showSummary, setShowSummary] = useState(false);
  const [status, setStatus] = useState('idle'); // idle | sending | sent | error
  const [sendError, setSendError] = useState('');
  const refs = useRef({});
  const trap = useRef(null);
  const alive = useRef(true);
  const errorRef = useRef(null);
  useEffect(() => {
  alive.current = true;
  return () => {
    alive.current = false;
  };
}, []);

  const update = (field) => (e) => {
    const next = { ...values, [field]: e.target.value };
    setValues(next);
    // once a field shows an error, re-check it as the person types so it clears when fixed
    if (errors[field]) {
      const msg = validateField(field, next);
      setErrors((prev) => {
        const copy = { ...prev };
        if (msg) copy[field] = msg;
        else delete copy[field];
        return copy;
      });
    }
  };

  const blur = (field) => () => {
    const msg = validateField(field, values);
    setErrors((prev) => {
      const copy = { ...prev };
      if (msg) copy[field] = msg;
      else delete copy[field];
      return copy;
    });
  };

  const submit = async (e) => {
    e.preventDefault();
    if (status === 'sending') return;
    const found = validateAll(values);
    setErrors(found);
    const invalid = FIELD_ORDER.filter((f) => found[f]);
    if (invalid.length) {
      setShowSummary(true);
      refs.current[invalid[0]]?.focus(); // move focus to the first problem
      return;
    }
    setShowSummary(false);
    setSendError('');
    setStatus('sending');
    try {
      await sendEnquiry({
        values,
        typeLabel: PROJECT_TYPE_OPTIONS.find((o) => o.value === values.type)?.label,
        project,
        honeypot: trap.current?.value || '',
      });
      if (alive.current) setStatus('sent'); // only reached when the server accepted it
    } catch (err) {
      if (!alive.current) return;
      const kind = err instanceof EnquiryError ? err.kind : 'network';
      if (kind === 'rejected' && Object.keys(err.fieldErrors).length) {
        setErrors(err.fieldErrors);
        setShowSummary(true);
        setStatus('idle');
        refs.current[Object.keys(err.fieldErrors)[0]]?.focus();
        return;
      }
      setSendError(
        kind === 'config'
          ? 'The enquiry form is not connected yet, so nothing was sent. Please email the studio directly at studio@formandframe.example.'
          : kind === 'network' || kind === 'timeout'
            ? 'We could not send your enquiry. Please check your connection and try again. Your details are still here.'
            : 'Something went wrong on our side and your enquiry was not sent. Please try again in a moment.'
      );
      setStatus('error');
      setTimeout(() => errorRef.current?.focus(), 0);
    }
  };

  if (status === 'sent') return <Confirmation values={values} project={project} />;

  const invalidFields = FIELD_ORDER.filter((f) => errors[f]);
  const describe = (f) => (errors[f] ? `${f}-error` : undefined);

  return (
    <div className="contact container">
      <div className="contact__intro">
        <span className="eyebrow">Contact</span>
        <h1>Start a conversation about your project.</h1>
        <p className="lead">Share a few details and the studio will get back to you by email.</p>

        <h2 className="eyebrow contact__next-title">What happens next</h2>
        <ol className="steps">
          <li>You send your enquiry</li>
          <li>The studio reviews it</li>
          <li>You receive a reply by email</li>
        </ol>
        <TextLink to="/projects">See our work first</TextLink>
      </div>

      <form className="contact__form" onSubmit={submit} noValidate aria-label="Project enquiry">
        {project && (
          <p className="prefill-note">
            Based on <strong>{project.name}</strong>. You can change anything below.
          </p>
        )}

        {showSummary && invalidFields.length > 0 && (
          <div className="form-summary" role="alert">
            <p className="form-summary__title">
              Please fix {invalidFields.length} {invalidFields.length === 1 ? 'field' : 'fields'} below.
            </p>
            <ul>
              {invalidFields.map((f) => (
                <li key={f}>
                  <a
                    href={`#${f}`}
                    onClick={(e) => {
                      e.preventDefault();
                      refs.current[f]?.focus();
                    }}
                  >
                    {FIELD_LABELS[f]}: {errors[f]}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

        <Field id="name" label="Name" error={errors.name}>
          <input
            id="name" name="name" ref={(el) => (refs.current.name = el)}
            className="control" type="text" autoComplete="name" placeholder="Your full name"
            value={values.name} onChange={update('name')} onBlur={blur('name')}
            aria-invalid={!!errors.name} aria-describedby={describe('name')}
          />
        </Field>

        <Field id="email" label="Email" error={errors.email}>
          <input
            id="email" name="email" ref={(el) => (refs.current.email = el)}
            className="control" type="email" autoComplete="email" inputMode="email" placeholder="name@example.com"
            value={values.email} onChange={update('email')} onBlur={blur('email')}
            aria-invalid={!!errors.email} aria-describedby={describe('email')}
          />
        </Field>

        <Field id="type" label="Project type" error={errors.type}>
          <select
            id="type" name="type" ref={(el) => (refs.current.type = el)}
            className="control" data-empty={values.type === ''}
            value={values.type} onChange={update('type')} onBlur={blur('type')}
            aria-invalid={!!errors.type} aria-describedby={describe('type')}
          >
            <option value="">Select a project type</option>
            {PROJECT_TYPE_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </Field>

        <Field id="message" label="Project description" error={errors.message}>
          <textarea
            id="message" name="message" ref={(el) => (refs.current.message = el)}
            className="control" rows={6} maxLength={1500}
            placeholder="Tell us about your project: where it is, how big, and what you hope to achieve."
            value={values.message} onChange={update('message')} onBlur={blur('message')}
            aria-invalid={!!errors.message} aria-describedby={describe('message')}
          />
        </Field>

        {status === 'error' && (
          <div className="form-summary" role="alert" ref={errorRef} tabIndex={-1}>
            <p className="form-summary__title">Your enquiry was not sent</p>
            <p>{sendError}</p>
          </div>
        )}

        {/* honeypot: hidden from people and screen readers, bots tend to fill it in */}
        <div className="contact__trap" aria-hidden="true">
          <label>Leave this field empty<input ref={trap} type="text" name="_gotcha" tabIndex={-1} autoComplete="off" /></label>
        </div>

        {/* mousedown preventDefault: stops the field's blur-validation from shifting the button
            under the pointer (which would cancel the click) */}
        <Button type="submit" block arrow={status !== 'sending'} disabled={status === 'sending'} className="contact__submit" onMouseDown={(e) => e.preventDefault()}>
          {status === 'sending' ? 'Sending…' : status === 'error' ? 'Try Again' : 'Send Enquiry'}
        </Button>
        <p className="contact__privacy">We&rsquo;ll only use your details to reply to your enquiry.</p>
      </form>
    </div>
  );
}

// Remount (reset the form) whenever the pre-fill parameters change.
export default function Contact() {
  const [params] = useSearchParams();
  return <ContactForm key={params.toString()} />;
}
