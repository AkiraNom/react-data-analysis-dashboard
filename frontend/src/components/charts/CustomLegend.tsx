const CustomLegend = (props: any) => {
  const { payload } = props;

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      width: '100%',
      marginTop: '12px'
    }}>
    <ul style={{
      listStyle: 'none',
      display: 'flex',
      flexWrap: 'wrap',
      gap: '12px',
      padding: 0,
      margin: 0,
      maxWidth: '100%',
    }}>
      {payload.map((entry: any, index: number) => (
        <li
          key={index}
          style={{
            cursor: 'pointer',
            color: entry.color,
            fontWeight: 'bold',
          }}
        >
          <span style={{
            display: 'inline-block',
            width: '12px',
            height: '12px',
            backgroundColor: entry.color,
            marginRight: '5px',
            borderRadius: '2px'
          }}></span>
          {entry.value}
        </li>
      ))}
    </ul>
    </div>
  );
};

export default CustomLegend;
