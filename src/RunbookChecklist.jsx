import { useState } from 'react';
import './RunbookChecklist.css';

const SECTIONS = [
  {
    id: 'setup',
    title: 'Genesis Edge Node Stack Setup',
    steps: [
      {
        id: 'setup-1',
        label: 'Verify hardware requirements: minimum 4-core CPU, 8 GB RAM, 64 GB storage.',
      },
      {
        id: 'setup-2',
        label: (
          <>
            Flash the approved OS image to the boot media and insert into the edge node.
          </>
        ),
      },
      {
        id: 'setup-3',
        label: 'Connect LAN and WAN network interfaces; confirm link lights are active.',
      },
      {
        id: 'setup-4',
        label: 'Power on the edge node and verify successful POST and OS boot sequence.',
      },
      {
        id: 'setup-5',
        label: (
          <>
            SSH into the node and complete initial host configuration (hostname, timezone, NTP).
          </>
        ),
      },
      {
        id: 'setup-6',
        label: (
          <>
            Run the installer:{' '}
            <code>sudo ./genesis-install.sh</code> and confirm all prerequisites pass.
          </>
        ),
      },
      {
        id: 'setup-7',
        label: (
          <>
            Populate required environment variables in{' '}
            <code>/etc/genesis/config.env</code>.
          </>
        ),
      },
      {
        id: 'setup-8',
        label: (
          <>
            Start and enable the stack:{' '}
            <code>sudo systemctl enable --now genesis-stack</code>.
          </>
        ),
      },
      {
        id: 'setup-9',
        label: (
          <>
            Confirm all services are running:{' '}
            <code>genesis status</code>.
          </>
        ),
      },
    ],
  },
  {
    id: 'verify',
    title: 'Verifying Deployments',
    steps: [
      {
        id: 'verify-1',
        label: (
          <>
            Check health endpoints:{' '}
            <code>curl http://localhost:8080/health</code> – expect HTTP 200.
          </>
        ),
      },
      {
        id: 'verify-2',
        label: (
          <>
            Confirm all containers are up:{' '}
            <code>docker ps</code> (or <code>podman ps</code>); no containers in Exited state.
          </>
        ),
      },
      {
        id: 'verify-3',
        label: 'Verify database connectivity and confirm all migrations have been applied.',
      },
      {
        id: 'verify-4',
        label: 'Test critical API endpoints manually and confirm expected responses.',
      },
      {
        id: 'verify-5',
        label: 'Validate CPU/memory utilization is within normal operating thresholds.',
      },
      {
        id: 'verify-6',
        label: (
          <>
            Review system logs for errors:{' '}
            <code>journalctl -u genesis-* --since -1h</code>.
          </>
        ),
      },
      {
        id: 'verify-7',
        label: 'Confirm the node is registered and visible in the central management console.',
      },
    ],
  },
  {
    id: 'backups',
    title: 'Configuring Backups',
    steps: [
      {
        id: 'backups-1',
        label: 'Identify and verify accessibility of the backup target (NAS, S3-compatible endpoint, or external drive).',
      },
      {
        id: 'backups-2',
        label: (
          <>
            Configure backup credentials and target in{' '}
            <code>/etc/genesis/backup.env</code>.
          </>
        ),
      },
      {
        id: 'backups-3',
        label: (
          <>
            Enable and start the backup service:{' '}
            <code>sudo systemctl enable --now genesis-backup</code>.
          </>
        ),
      },
      {
        id: 'backups-4',
        label: (
          <>
            Trigger an initial manual backup:{' '}
            <code>genesis backup --now</code> and wait for completion.
          </>
        ),
      },
      {
        id: 'backups-5',
        label: 'Verify backup completed successfully and run integrity check on snapshot.',
      },
      {
        id: 'backups-6',
        label: (
          <>
            Confirm automated backup schedule is active:{' '}
            <code>genesis backup --schedule</code>.
          </>
        ),
      },
      {
        id: 'backups-7',
        label: 'Perform a test restore from the latest backup snapshot to confirm recoverability.',
      },
    ],
  },
  {
    id: 'cicd',
    title: 'CI/CD Pipeline Integration',
    steps: [
      {
        id: 'cicd-1',
        label: 'Obtain the pipeline runner registration token from the CI/CD management console.',
      },
      {
        id: 'cicd-2',
        label: (
          <>
            Register the edge node as a pipeline runner:{' '}
            <code>genesis runner register --token &lt;TOKEN&gt;</code>.
          </>
        ),
      },
      {
        id: 'cicd-3',
        label: 'Set runner tags, environment, and concurrency limits in the runner configuration file.',
      },
      {
        id: 'cicd-4',
        label: 'Trigger a test pipeline job and confirm the runner picks it up and completes successfully.',
      },
      {
        id: 'cicd-5',
        label: 'Verify job artifacts are stored and accessible from the pipeline console.',
      },
      {
        id: 'cicd-6',
        label: 'Configure deployment approval gates and environment protection rules as required.',
      },
      {
        id: 'cicd-7',
        label: 'Record node hostname, IP address, runner ID, and installation date in the infrastructure inventory.',
      },
    ],
  },
];

function ChecklistItem({ step, checked, onToggle }) {
  return (
    <li className={checked ? 'checked' : ''}>
      <input
        type="checkbox"
        id={step.id}
        checked={checked}
        onChange={() => onToggle(step.id)}
        aria-label={typeof step.label === 'string' ? step.label : step.id}
      />
      <label htmlFor={step.id} className="runbook-step-label">
        {step.label}
      </label>
    </li>
  );
}

function RunbookChecklist() {
  const initialState = () =>
    Object.fromEntries(
      SECTIONS.flatMap((s) => s.steps.map((step) => [step.id, false]))
    );

  const [checked, setChecked] = useState(initialState);

  const toggle = (id) =>
    setChecked((prev) => ({ ...prev, [id]: !prev[id] }));

  const completedCount = Object.values(checked).filter(Boolean).length;
  const totalCount = Object.values(checked).length;

  const today = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="runbook">
      <header className="runbook-header">
        <h1>Genesis Edge Node — On-Site Technician Runbook</h1>
        <p className="runbook-meta">
          Revision 1.0 &nbsp;|&nbsp; {today} &nbsp;|&nbsp; {completedCount}/{totalCount} steps
          completed
        </p>
        <button
          className="runbook-print-btn"
          onClick={() => window.print()}
          aria-label="Print runbook"
        >
          🖨 Print Checklist
        </button>
      </header>

      {SECTIONS.map((section, idx) => (
        <section key={section.id} className="runbook-section" aria-labelledby={`section-${section.id}`}>
          <div className="runbook-section-header">
            <span className="runbook-section-number">{idx + 1}</span>
            <h2 id={`section-${section.id}`}>{section.title}</h2>
          </div>
          <ul className="runbook-checklist" role="list">
            {section.steps.map((step) => (
              <ChecklistItem
                key={step.id}
                step={step}
                checked={checked[step.id]}
                onToggle={toggle}
              />
            ))}
          </ul>
        </section>
      ))}

      <div className="runbook-signature">
        <div className="runbook-signature-field">Technician Name &amp; Signature</div>
        <div className="runbook-signature-field">Date Completed</div>
      </div>

      <footer className="runbook-footer">
        <span>Genesis Edge Node Runbook v1.0</span>
        <span>Internal use only – do not distribute externally</span>
      </footer>
    </div>
  );
}

export default RunbookChecklist;
