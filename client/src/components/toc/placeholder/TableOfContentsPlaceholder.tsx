import styles from "./placeholder.module.scss";
import React, {FunctionComponent} from "react";

const TableOfContentsPlaceholder: FunctionComponent = () => (
    <li className={styles.tocPlaceholder}>&nbsp;</li>
);

export default TableOfContentsPlaceholder;