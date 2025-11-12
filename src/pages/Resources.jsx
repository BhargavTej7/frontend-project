const ResourceLink = ({ title, description, href }) => (
  <a className="resource-card" href={href} target="_blank" rel="noreferrer">
    <h3>{title}</h3>
    <p>{description}</p>
    <span>Open resource ↗</span>
  </a>
)

const Resources = () => {
  return (
    <div className="page resources">
      <header className="page-header">
        <div>
          <h1>Farmer enablement resources</h1>
          <p>
            Step-by-step guides, downloadable templates, and partner programs to
            help convert crops into premium value-added goods.
          </p>
        </div>
      </header>

      <section className="resource-section">
        <h2>Blueprints &amp; SOPs</h2>
        <div className="resource-grid">
          <ResourceLink
            title="Solar dehydration playbook"
            description="Design a solar dehydration workflow with airflow planning, moisture calibration, and hygienic handling checklists."
            href="https://www.fao.org/3/i2951e/i2951e.pdf"
          />
          <ResourceLink
            title="Post-harvest processing SOP"
            description="Standard operating procedures for smallholder groups to maintain quality consistency across batches."
            href="https://www.apo-tokyo.org/publications/"
          />
          <ResourceLink
            title="Packaging cost calculator"
            description="Spreadsheet template to model unit economics, packaging formats, and logistics readiness."
            href="https://docs.google.com/spreadsheets"
          />
        </div>
      </section>

      <section className="resource-section">
        <h2>Compliance labs</h2>
        <div className="resource-grid">
          <ResourceLink
            title="Global certifications checklist"
            description="Navigate organic, HACCP, FairTrade, and Halal certifications with documentation templates."
            href="https://www.iso.org/food-safety"
          />
          <ResourceLink
            title="Digital traceability tools"
            description="Leverage QR-based product passports to share lab results, farmer stories, and carbon data."
            href="https://www.gs1.org/standards/traceability"
          />
          <ResourceLink
            title="Export documentation kit"
            description="Comprehensive checklist for invoices, sanitary certificates, and customs paperwork."
            href="https://www.intracen.org/resources"
          />
        </div>
      </section>

      <section className="resource-section">
        <h2>Partner accelerators</h2>
        <div className="resource-grid">
          <ResourceLink
            title="Rural maker labs"
            description="Book prototyping time in shared value-add facilities operated by local FPOs and cooperatives."
            href="https://www.startupindia.gov.in/"
          />
          <ResourceLink
            title="Impact finance programs"
            description="Unlock catalytic capital for equipment upgrades, working capital, and export documentation."
            href="https://www.growasia.org/"
          />
          <ResourceLink
            title="Circular packaging alliances"
            description="Find packaging partners committed to compostable and recyclable solutions."
            href="https://www.newplasticseconomy.org/"
          />
        </div>
      </section>
    </div>
  )
}

export default Resources


