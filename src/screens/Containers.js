import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faPauseCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import '../CSS/Containers.css';

import activeContainer from '../assets/container-active.png';
import inactiveContainer from '../assets/container-inactive.png';
import deadContainer from '../assets/container-dead.png';

const Containers = ({ containersStatus }) => {
    // Fonction pour regrouper les conteneurs par groupe
    const groupContainers = (containers) => {
        const groups = {};
        containers.forEach(container => {
            if (!groups[container.groupId]) {
                groups[container.groupId] = [];
            }
            groups[container.groupId].push(container);
        });
        return Object.values(groups); // Retourne un tableau de groupes
    };

    const groupedData = groupContainers(containersStatus);

    // Fonction pour déterminer l'image en fonction du statut
    const getContainerImage = (status) => {
        switch (status) {
            case 'actif':
                return activeContainer;
            case 'inactif':
                return inactiveContainer;
            case 'mort':
                return deadContainer;
            default:
                return null;
        }
    };

    // Fonction pour déterminer l'icône en fonction du statut
    const getStatusIcon = (status) => {
        switch (status) {
            case 'actif':
                return <FontAwesomeIcon icon={faCheckCircle} />;
            case 'inactif':
                return <FontAwesomeIcon icon={faPauseCircle} />;
            case 'mort':
                return <FontAwesomeIcon icon={faTimesCircle} />;
            default:
                return null;
        }
    };

    // Fonction pour déterminer la classe de statut
    const getStatusClass = (status) => {
        switch (status) {
            case 'actif':
                return 'status-active';
            case 'inactif':
                return 'status-inactive';
            case 'mort':
                return 'status-dead';
            default:
                return '';
        }
    };

    const renderItem = (item) => (
        <div
            key={item.id}
            className={`container-item ${getStatusClass(item.status)}`}
        >
            <img
                src={getContainerImage(item.status)}
                alt={`Conteneur ${item.status}`}
                className="container-image"
            />
            <p className="container-text">Conteneur {item.id}</p>
            <p className="status-text">
                {getStatusIcon(item.status)} Statut: {item.status}
            </p>
            {item.hash && <p className="hash-text">Hash: {item.hash}</p>}
        </div>
    );

    const renderGroup = (group, index) => (
        <div key={index} className="group-container">
            <h3 className="group-title">Groupe {group[0].groupId}</h3>
            <div className="group-grid">
                {group.map(container => renderItem(container))}
            </div>
        </div>
    );

    return (
        <div className="containers">
            <div className="groups-container">
                {groupedData.map((group, index) => renderGroup(group, index))}
            </div>
        </div>
    );
};

export default Containers;