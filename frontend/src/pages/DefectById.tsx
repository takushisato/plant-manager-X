import Layout from "@/layouts/Layout";
import { useDefectStore } from "@/hooks/useDefectStore";
import { useEffect } from "react";
const DefectById = () => {
  const { defectItem, getDefect } = useDefectStore();

  useEffect(() => {
    getDefect();
  }, []);

  return (
    <Layout>
      <p>不具合の詳細</p>
      <p>{defectItem.title}</p>
      <p>{defectItem.defect_detail}</p>
      <p>{defectItem.submission}</p>
      <p>{defectItem.submission_deadline}</p>
      <p>{defectItem.create_user}</p>
      <p>{defectItem.order}</p>
    </Layout>
  );
};

export default DefectById;
