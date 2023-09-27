import axios from 'axios';
import React from "react";
import { Link } from "react-router-dom";
import { Button, Container, Divider, Form, Header, Icon, Menu, Modal, Segment, Table } from 'semantic-ui-react';
import MenuSistema from '../../MenuSistema';

class ListProduto extends React.Component{

    state = {

        listaProdutos: [],
        openModal: false,
        idRemover: null,
        menuFiltro: false,
        codigo: '',
        titulo: '',
        idCategoria: '',
        listaCategoriaProduto: []
    }

    componentDidMount = () => {
      
        this.carregarLista();
      
    }

    carregarLista = () => {

        axios.get("http://localhost:8080/api/produto")
        .then((response) => {
          
            this.setState({
                listaProdutos: response.data
            })
        })

        axios.get("http://localhost:8080/api/categoriaproduto")
        .then((response) => {

            const dropDownCategorias = [];
            dropDownCategorias.push({ text: '', value: '' });
            response.data.map(c => (
                dropDownCategorias.push({ text: c.descricao, value: c.id })
            ))
          
            this.setState({
                listaCategoriaProduto: dropDownCategorias
            })
        })

    };

    confirmaRemover = (id) => {

        this.setState({
            openModal: true,
            idRemover: id
        })  
    }

    setOpenModal = (val) => {

        this.setState({
            openModal: val
        })
   
    };

    remover = async () => {

        await axios.delete('http://localhost:8080/api/produto/' + this.state.idRemover)
        .then((response) => {
   
            this.setState({ openModal: false })
            console.log('Produto removido com sucesso.')
   
            axios.get("http://localhost:8080/api/produto")
            .then((response) => {
           
                this.setState({
                    listaProdutos: response.data
                })
            })
        })
        .catch((error) => {
            this.setState({  openModal: false })
            console.log('Erro ao remover um produto.')
        })
    };

    handleMenuFiltro = () => {
        this.state.menuFiltro === true ? this.setState({menuFiltro: false}) : this.setState({menuFiltro: true})
    }

    handleChangeCodigo = (e, {value}) => {
        this.setState({
            codigo: value
        }, () => this.filtrarProdutos())
    }

    handleChangeTitulo = (e, {value}) => {
        this.setState({
            titulo: value
        }, () => this.filtrarProdutos())
    }

    handleChangeCategoriaProduto = (e, { value }) => {
        this.setState({ 
            idCategoria: value,
        }, () => this.filtrarProdutos())
    }

    filtrarProdutos = () => {

        let formData = new FormData();

        formData.append('codigo', this.state.codigo);
        formData.append('titulo', this.state.titulo);
        formData.append('idCategoria', this.state.idCategoria);

        axios.post("http://localhost:8080/api/produto/filtrar", formData)
        .then((response) => {
            this.setState({
                listaProdutos: response.data
            })
        })
    
    }

    render(){
        return(
            <div>

                <MenuSistema />

                <div style={{marginTop: '3%'}}>

                    <Container textAlign='justified' >

                        <h2> Produto </h2>

                        <Divider />

                        <div style={{marginTop: '4%'}}>

                            <Menu compact>
                                <Menu.Item
                                    name='menuFiltro'
                                    active={this.state.menuFiltro === true}
                                    onClick={this.handleMenuFiltro}
                                >
                                    <Icon name='filter' />
                                    Filtrar
                                </Menu.Item>
                            </Menu>

                            <Button
                                label='Novo'
                                circular
                                color='orange'
                                icon='clipboard outline'
                                floated='right'
                                as={Link} 
                                to='/form-produto'
                            />

                            { this.state.menuFiltro ?
                                
                                <Segment>
                                    <Form className="form-filtros">
                                        <Form.Input
                                            icon="search"
                                            value={this.state.codigo}
                                            onChange={this.handleChangeCodigo}
                                            label='Código do Produto'
                                            placeholder='Filtrar por Código do Produto'
                                            labelPosition='left'
                                            width={4}
                                        />
                                        <Form.Group widths='equal'> 
                                            <Form.Input
                                                icon="search"
                                                value={this.state.titulo}
                                                onChange={this.handleChangeTitulo}
                                                label='Título'
                                                placeholder='Filtrar por título'
                                                labelPosition='left'
                                            />
                                            
                                            <Form.Select
                                                placeholder='Filtrar por Categoria'
                                                label='Categoria'
                                                options={this.state.listaCategoriaProduto}
                                                value={this.state.idCategoria}
                                                onChange={this.handleChangeCategoriaProduto}
                                            />  
                                        </Form.Group>
                                    </Form>
                                </Segment>:""
                            }

                            <br/><br/>
                      
                            <Table color='orange' sortable celled>

                                <Table.Header>
                                    <Table.Row>
                                        <Table.HeaderCell>Código</Table.HeaderCell>
                                        <Table.HeaderCell>Categoria</Table.HeaderCell>
                                        <Table.HeaderCell>Título</Table.HeaderCell>
                                        <Table.HeaderCell>Descrição</Table.HeaderCell>
                                        <Table.HeaderCell>Valor Unitário</Table.HeaderCell>
                                        <Table.HeaderCell>Tempo Mínimo de Entrega</Table.HeaderCell>
                                        <Table.HeaderCell>Tempo Máximo de Entrega</Table.HeaderCell>
                                        <Table.HeaderCell textAlign='center' width={2}>Ações</Table.HeaderCell>
                                    </Table.Row>
                                </Table.Header>
                          
                                <Table.Body>

                                    { this.state.listaProdutos.map(p => (

                                        <Table.Row key={p.id}>
                                            <Table.Cell>{p.codigo}</Table.Cell>
                                            <Table.Cell>{p.categoria.descricao}</Table.Cell>
                                            <Table.Cell>{p.titulo}</Table.Cell>
                                            <Table.Cell>{p.descricao}</Table.Cell>
                                            <Table.Cell>{p.valorUnitario}</Table.Cell>
                                            <Table.Cell>{p.tempoEntregaMinimo}</Table.Cell>
                                            <Table.Cell>{p.tempoEntregaMaximo}</Table.Cell>
                                            <Table.Cell textAlign='center'>
                                              
                                            <Button
                                                inverted
                                                circular
                                                color='green'
                                                title='Clique aqui para editar os dados deste cliente'
                                                icon>
                                                    <Link to="/form-produto" state={{id: p.id}} style={{color: 'green'}}> <Icon name='edit' /> </Link>
                                            </Button> &nbsp;
                                                
                                                <Button
                                                   inverted
                                                   circular
                                                   icon='trash'
                                                   color='red'
                                                   title='Clique aqui para remover este cliente' 
                                                   onClick={e => this.confirmaRemover(p.id)} />

                                            </Table.Cell>
                                       </Table.Row>
                                   ))}

                               </Table.Body>
                           </Table>
                       </div>
                   </Container>
               </div>

               <Modal
                    basic
                    onClose={() => this.setOpenModal(false)}
                    onOpen={() => this.setOpenModal(true)}
                    open={this.state.openModal}
                >
                    <Header icon>
                            <Icon name='trash' />
                            <div style={{marginTop: '5%'}}> Tem certeza que deseja remover esse registro? </div>
                    </Header>
                    <Modal.Actions>
                            <Button basic color='red' inverted onClick={() => this.setOpenModal(false)}>
                                <Icon name='remove' /> Não
                            </Button>
                            <Button color='green' inverted onClick={() => this.remover()}>
                                <Icon name='checkmark' /> Sim
                            </Button>
                    </Modal.Actions>
                </Modal>
                
           </div>
       )
   }
}

export default ListProduto;