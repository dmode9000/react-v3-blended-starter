type Props = {
  children: React.ReactNode;
  sidebar: React.ReactNode;
};

const NotesLayout = ({ children, sidebar }: Props) => {
  return (
    <section style={{ flex: 1, display: 'flex', gap: '20px' }}>
      <aside style={{ backgroundColor: 'gray' }}>{sidebar}</aside>
      <div style={{ width: '100%' }}>{children}</div>
    </section>
  );
};

export default NotesLayout;
