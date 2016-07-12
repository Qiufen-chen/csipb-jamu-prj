### Experiment/Logging Config
seed = 0
testSize = 0.25
datasetName = 'stahl-maccs'
nTanimotoIndividualInPercentage = 0
xprmtDir = '/home/tor/robotics/prj/csipb-jamu-prj/xprmt/similarity-func'

datasetDir = '../data'
datasetPath = datasetDir+'/'+datasetName+'/'+datasetName+'.csv'
xprmtTag = datasetName

### DEAP GP Config
nIndividual = 100
nMaxGen = 100 # not including the initial generation
pMut = 0.3
pCx = 0.5

treeMinDepth = 2
treeMaxDepth = 3
subtreeMinDepthMut = 1
subtreeMaxDepthMut = 1

nHOF = nIndividual
recallFitnessOnlyIfIndependent = False
# convergenceThreshold = -0.1

### fitness recall config
nRefPerClassInPercentage = 20
nTopInPercentage = 20

### KendallTauTest Config
maxKendallTauTestTrial = 3
pValueAcceptance = 0.05
