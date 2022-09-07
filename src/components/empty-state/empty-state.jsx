import './empty-state.scss';
import './empty-state.mobile.scss';

function EmptyState({ title, description, icon, containerPadding }) {
  return (
    <div className="empty-state-container" style={containerPadding}>
      <div className="empty-state-icon-container">
        <span className="gradient-background empty-state-color">{icon}</span>
      </div>

      <div className="empty-state-title-container">
        <h3 className="empty-state-color">{title}</h3>
      </div>

      <div>
        <p className="empty-state-color">{description}</p>
      </div>
    </div>
  );
}

export default EmptyState;
