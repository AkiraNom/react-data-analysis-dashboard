const ERDiagram: React.FC = () => {
    return (
      <div className="bg-gray-50 border border-gray-300 rounded-md p-4 text-sm">
        <p className="font-medium mb-2">Entity Relationship Diagram</p>
        <img
            src="../../public/databaseERDiagram.png"
            alt="ER Diagram"
            className="w-full max-w-3xl mx-auto border rounded-md shadow-md"
        />
      </div>
    );
  };

  export default ERDiagram;
