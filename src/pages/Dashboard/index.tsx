import { useEffect, useState} from 'react';

import Header from '../../components/Header';
import api from '../../services/api';
import Food from '../../components/Food';
import ModalAddFood from '../../components/ModalAddFood';
import ModalEditFood from '../../components/ModalEditFood';
import { FoodsContainer } from './styles';
import { FoodModel } from 'Types';

function Dashboard() {
    
    const [foods, setFoods] = useState<FoodModel[]>([]);
    const [editingFood, setEditingFood] = useState<FoodModel>({} as FoodModel);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
    
    useEffect(() => {
        async function loadFoods() {
            const response = await api.get('/foods');
            
            setFoods(response.data);
        }
        
        loadFoods();
    }, []);

    async function handleAddFood(food: FoodModel) {

        try {
            const response = await api.post('/foods', {
                ...food,
                available: true,
            });

            
            setFoods(
                [
                    ...foods, 
                    response.data
                ]
            )
        } catch (err) {
            console.log(err);
        }
    }

    async function handleUpdateFood(food: FoodModel) {

        try {
            const foodUpdated = await api.put(
                `/foods/${editingFood.id}`,
                { ...editingFood, ...food },
            );

            const foodsUpdated = foods.map(f =>
                f.id !== foodUpdated.data.id ? f : foodUpdated.data,
            );
            
            setFoods(foodsUpdated);
        } catch (err) {
            console.log(err);
        }
    }

    async function handleDeleteFood(id: number) {

        await api.delete(`/foods/${id}`);

        const foodsFiltered = foods.filter(food => food.id !== id);

        setFoods(foodsFiltered);
    }

    function toggleModal() {
        setIsModalOpen(!isModalOpen);
    }

    function toggleEditModal() {
        setIsEditModalOpen(!isEditModalOpen);
    }

    function handleEditFood(food: FoodModel) {
        setEditingFood(food);
        setIsEditModalOpen(true);
    }

    return  (
        <>
            <Header openModal={toggleModal} />
            <ModalAddFood
                isOpen={isModalOpen}
                setIsOpen={toggleModal}
                handleAddFood={handleAddFood}
            />
            <ModalEditFood
                isOpen={isEditModalOpen}
                setIsOpen={toggleEditModal}
                editingFood={editingFood}
                handleUpdateFood={handleUpdateFood}
            />

            <FoodsContainer data-testid="foods-list">
            {foods &&
                foods.map(food => (
                    <Food
                        key={food.id}
                        food={food}
                        handleDelete={handleDeleteFood}
                        handleEditFood={handleEditFood}
                    />
                ))}
            </FoodsContainer>
        </>
    );
    
}

export default Dashboard;
