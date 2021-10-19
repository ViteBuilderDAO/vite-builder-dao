export async function getProjects() {
  //crowdfundInstance.methods.returnAllProjects().call().then((projects) =>
  //{
  //    projects.forEach((projectAddress) =>
  //    {
  //        const projectInst = crowdfundProject(projectAddress)
  //        projectInst.methods.getDetails().call().then((projectData) =>
  //        {
  //            const projectInfo = projectData;
  //            projectInfo.isLoading = false;
  //            projectInfo.contract = projectInst;
  //            this.projectData.push(projectInfo);
  //        });
  //    });
  //});
}

export async function startProject() {
  //this.newProject.isLoading = true
  //crowdfundInstance.methods.startProject(
  //    this.newProject.title,
  //    this.newProject.description,
  //    this.newProject.duration,
  //    web3.utils.toWei(this.newProject.amountGoal, 'ether'),
  //).send({
  //  from: this.account,
  //}).then((res) => {
  //    const projectInfo = res.events.ProjectStarted.returnValues;
  //    projectInfo.isLoading = false;
  //    projectInfo.currentAmount = 0;
  //    projectInfo.currentState = 0;
  //    projectInfo.contract = crowdfundProject(projectInfo.contractAddress);
  //    this.startProjectDialog = false;
  //    this.newProject = { isLoading: false };
  //});
}

export async function fundProject(index) {
  //if (!this.projectData[index].fundAmount)
  //{
  //    return;
  //}

  //const projectContract = this.projectData[index].contract
  //this.projectData[index].isLoading = true
  //projectContract.methods.contribute().send(
  //{
  //    from: this.account,
  //    //value: web3.utils.toWei(this.projectData[index].fundAmount, 'ether'),
  //}).then((res) =>
  //{
  //    const newTotal = parseInt(res.events.FundingReceived.returnValues.currentTotal, 10);
  //    const projectGoal = parseInt(this.projectData[index].goalAmount, 10);
  //    this.projectData[index].currentAmount = newTotal;
  //    this.projectData[index].isLoading = false;

  //    // Set project state to success
  //    if (newTotal >= projectGoal) {
  //      this.projectData[index].currentState = 2;
  //    }
  //});
}

export async function getRefund (index) {
  //this.projectData[index].isLoading = true
  //this.projectData[index].contract.methods.getRefund().send(
  //{
  //    from: this.account,
  //}).then(() =>
  //{
  //    this.projectData[index].isLoading = false;
  //});
}