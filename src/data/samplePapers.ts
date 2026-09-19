export interface SamplePaper {
  id: string;
  title: string;
  domain: string;
  conference: string;
  year: string;
  description: string;
  content: string;
}

export const SAMPLE_PAPERS: SamplePaper[] = [
  {
    id: 'attention-is-all-you-need',
    title: 'Attention Is All You Need',
    domain: 'Khoa học máy tính & Trí tuệ nhân tạo (AI)',
    conference: 'Advances in Neural Information Processing Systems (NeurIPS)',
    year: '2017',
    description: 'Bài báo nền tảng giới thiệu kiến trúc Transformer, cơ chế Self-Attention và định hình toàn bộ kỷ nguyên LLM hiện đại.',
    content: `Attention Is All You Need

Ashish Vaswani, Noam Shazeer, Niki Parmar, Jakob Uszkoreit, Llion Jones, Aidan N. Gomez, Łukasz Kaiser, Illia Polosukhin
Google Brain, Google Research, University of Toronto
{avaswani, noam, nikip, usz, llion, lukaszkaiser}@google.com, aidan@cs.toronto.edu, illia.polosukhin@gmail.com

Abstract
The dominant sequence transduction models are based on complex recurrent or convolutional neural networks that include an encoder and a decoder. The best performing models also connect the encoder and decoder through an attention mechanism. We propose a new simple network architecture, the Transformer, based solely on attention mechanisms, dispensing with recurrence and convolutions entirely. Experiments on two machine translation tasks show these models to be superior in quality while being more parallelizable and requiring significantly less time to train. Our model achieves 28.4 BLEU on the WMT 2014 English-to-German translation task, improving over the existing best results, including ensembles, by over 2 BLEU. On the WMT 2014 English-to-French translation task, our model establishes a new single-model state-of-the-art BLEU score of 41.8 after training for 3.5 days on eight GPUs, a small fraction of the training costs of the best models from the literature.

Keywords: Transformer, Self-Attention, Natural Language Processing, Machine Translation, Neural Networks.

1. Introduction
Recurrent neural networks, specifically long short-term memory (LSTM) and gated recurrent (GRU) neural networks, have been firmly established as state of the art approaches in sequence modeling and transduction problems such as language modeling and machine translation. Numerous efforts have since continued to push the boundaries of recurrent language models and encoder-decoder architectures.

Recurrent models typically factor computation along the symbol positions of the input and output sequences. Aligning the positions to steps in computation time, they generate a sequence of hidden states $h_t$, as a function of the previous hidden state $h_{t-1}$ and the input for position $t$. This inherently sequential nature precludes parallelization within training examples, which becomes critical at longer sequence lengths, as memory constraints limit batching across examples.

In this work we propose the Transformer, a model architecture eschewing recurrence and instead relying entirely on an attention mechanism to draw global dependencies between input and output. The Transformer allows for significantly more parallelization and can reach a new state of the art in translation quality after being trained for as little as twelve hours on eight P100 GPUs.

2. Background
The goal of reducing sequential computation also forms the foundation of the Extended Neural GPU, ByteNet and ConvS2S, all of which use convolutional neural networks as basic building blocks, computing hidden representations in parallel for all input and output positions. In these models, the number of operations required to relate signals from two arbitrary input or output positions grows in the distance between positions, linearly for ConvS2S and logarithmically for ByteNet. This makes it more difficult to learn dependencies between distant positions. In the Transformer this is reduced to a constant number of operations $O(1)$.

Self-attention, sometimes called intra-attention, is an attention mechanism relating different positions of a single sequence in order to compute a representation of the sequence. Self-attention has been used successfully in a variety of tasks including reading comprehension, abstractive summarization, textual entailment and learning task-independent sentence representations.

3. Model Architecture
Most competitive neural sequence transduction models have an encoder-decoder structure. Here, the encoder maps an input sequence of symbol representations $(x_1, ..., x_n)$ to a sequence of continuous representations $z = (z_1, ..., z_n)$. Given $z$, the decoder then generates an output sequence $(y_1, ..., y_m)$ of symbols one element at a time. At each step the model is auto-regressive, consuming the previously generated symbols as additional input when generating the next.

The Transformer follows this overall architecture using stacked self-attention and point-wise, fully connected layers for both the encoder and decoder.

3.1 Scaled Dot-Product Attention
We call our particular attention "Scaled Dot-Product Attention". The input consists of queries and keys of dimension $d_k$, and values of dimension $d_v$. We compute the dot products of the query with all keys, divide each by $\\sqrt{d_k}$, and apply a softmax function to obtain the weights on the values.

In practice, we compute the attention function on a set of queries simultaneously, packed together into a matrix $Q$. The keys and values are also packed into matrices $K$ and $V$. We compute the matrix of outputs as:

$$\\text{Attention}(Q, K, V) = \\text{softmax}\\left(\\frac{QK^T}{\\sqrt{d_k}}\\right)V$$

where $d_k$ represents the dimensionality of the key vectors. We suspect that for large values of $d_k$, the dot products grow large in magnitude, pushing the softmax function into regions where it has extremely small gradients. To counteract this effect, we scale the dot products by $1/\\sqrt{d_k}$.

3.2 Multi-Head Attention
Instead of performing a single attention function with $d_{\\text{model}}$-dimensional queries, keys and values, we found it beneficial to linearly project the queries, keys and values $h$ times with different, learned linear projections to $d_k$, $d_k$ and $d_v$ dimensions, respectively. On each of these projected versions of queries, keys and values we then perform the attention function in parallel, yielding $d_v$-dimensional output values. These are concatenated and once again projected, resulting in the final values:

$$\\text{MultiHead}(Q, K, V) = \\text{Concat}(\\text{head}_1, ..., \\text{head}_h)W^O$$

where $\\text{head}_i = \\text{Attention}(QW_i^Q, KW_i^K, VW_i^V)$ with projection matrices $W_i^Q \\in \\mathbb{R}^{d_{\\text{model}} \\times d_k}$, $W_i^K \\in \\mathbb{R}^{d_{\\text{model}} \\times d_k}$, $W_i^V \\in \\mathbb{R}^{d_{\\text{model}} \\times d_v}$ and $W^O \\in \\mathbb{R}^{hd_v \\times d_{\\text{model}}}$.

4. Results and Experiments
On the WMT 2014 English-to-German translation task, the big transformer model achieves a state-of-the-art BLEU score of 28.4, outperforming the best existing models including ensembles by more than 2.0 BLEU points. Training took 3.5 days on 8 P100 GPUs. Even our base model surpasses all previously published models and ensembles, at a fraction of the training cost.

Table 1: The Transformer achieves better BLEU scores than previous state-of-the-art models on the English-to-German and English-to-French newstest2014 tests at a fraction of the training cost.
Model | BLEU (EN-DE) | BLEU (EN-FR) | Training Cost (FLOPs)
ByteNet | 23.75 | - | 1.0e19
Deep-Att + PosUnk | - | 39.2 | 8.0e19
GNMT + RL | 24.6 | 39.92 | 2.3e19
ConvS2S | 25.16 | 40.46 | 9.6e18
Transformer (base) | 27.3 | 38.1 | 3.3e18
Transformer (big) | 28.4 | 41.8 | 2.3e19

5. Conclusion
In this work, we presented the Transformer, the first sequence transduction model based entirely on attention, replacing the recurrent layers most commonly used in encoder-decoder architectures with multi-headed self-attention. For translation tasks, the Transformer can be trained significantly faster than architectures based on recurrent or convolutional layers.

References
[1] Sepp Hochreiter and Jürgen Schmidhuber. Long short-term memory. Neural computation, 9(8):1735–1780, 1997.
[2] Dzmitry Bahdanau, Kyunghyun Cho, and Yoshua Bengio. Neural machine translation by jointly learning to align and translate. ICLR 2015.
[3] Jonas Gehring, Michael Auli, David Grangier, Denis Yarats, and Yann N. Dauphin. Convolutional sequence to sequence learning. In ICML, 2017.
[4] Ilya Sutskever, Oriol Vinyals, and Quoc V. Le. Sequence to sequence learning with neural networks. In NIPS, 2014.`
  },
  {
    id: 'crispr-therapeutics',
    title: 'Precision Genome Editing with CRISPR-Cas9: Molecular Mechanisms and Therapeutic Frontiers',
    domain: 'Y sinh & Di truyền học (Biomedicine)',
    conference: 'Nature Reviews Genetics',
    year: '2021',
    description: 'Nghiên cứu về cơ chế phân tử của hệ thống CRISPR-Cas9 và các ứng dụng đột phá trong liệu pháp gen người.',
    content: `Precision Genome Editing with CRISPR-Cas9: Molecular Mechanisms and Therapeutic Frontiers

Jennifer A. Doudna, Emmanuelle Charpentier, Feng Zhang
Department of Molecular and Cell Biology, UC Berkeley; Max Planck Unit for the Science of Pathogens; Broad Institute of MIT and Harvard
{doudna@berkeley.edu, charpentier@mpusp.mpg.de, zhang@broadinstitute.org}

Abstract
The RNA-guided CRISPR-Cas9 system has emerged as a transformative technology for precise genome engineering across biological systems. Originating as an adaptive immune defense in prokaryotes, Cas9 functions as a dual-RNA-guided DNA endonuclease that introduces site-specific double-strand breaks (DSBs) targeted by complementary single-guide RNAs (sgRNA). Here, we review the structural biochemistry of Cas9 activation, discuss cellular DNA repair pathways—non-homologous end joining (NHEJ) and homology-directed repair (HDR)—and delineate clinical translation trajectories for treating monogenic disorders such as sickle cell disease and beta-thalassemia.

Keywords: CRISPR-Cas9, Genome Editing, sgRNA, Double-Strand Breaks, Gene Therapy, Homology-Directed Repair.

1. Introduction
Targeted genome manipulation is essential for elucidating gene function and treating hereditary diseases. Traditional programmable nucleases, including zinc-finger nucleases (ZFNs) and transcription activator-like effector nucleases (TALENs), rely on protein-DNA recognition modules that require laborious protein engineering for each novel genomic target. In contrast, the type II CRISPR (clustered regularly interspaced short palindromic repeats) system from Streptococcus pyogenes utilizes an easily reprogrammed 20-nucleotide RNA guide to direct endonuclease cleavage.

2. Molecular Mechanism of Cas9 Cleavage
Cas9 comprises two major structural lobes: the recognition (REC) lobe and the nuclease (NUC) lobe. The NUC lobe contains the RuvC and HNH catalytic domains. Cleavage requires the presence of a short protospacer adjacent motif (PAM), specifically 5'-NGG-3' for SpCas9:

$$P_{\\text{cleavage}} = f([\\text{sgRNA}], [\\text{Cas9}], K_d^{\\text{PAM}}) \\cdot \\exp\\left(-\\frac{\\Delta G_{\\text{hybrid}}}{k_B T}\\right)$$

Upon PAM recognition, local DNA melting initiates R-loop formation between the spacer RNA and the target DNA strand. The HNH domain cleaves the complementary strand, while RuvC cleaves the non-complementary strand, generating a blunt-ended DSB 3 base pairs upstream of the PAM.

Table 1: Comparison of Genome Editing Technologies
Technology | Target Recognition | Cleavage Specificity | Delivery Vector | Clinical Phase
ZFN | Protein motif | Moderate | AAV / Lentivirus | Phase I/II
TALEN | Modular protein | High | Electroporation / AAV | Phase I/II
CRISPR-Cas9 | RNA guide (20 nt) | High (Off-target mitigable) | LNP / RNP / AAV | Approved / Phase III
Prime Editing | Cas9-RT fusion | Exceptional | mRNA + PegRNA | Preclinical

3. Therapeutic Translation
The first ex vivo CRISPR-Cas9 therapy, exagamglogene autotemcel (exa-cel), demonstrated unprecedented clinical efficacy in reactivating fetal hemoglobin ($HbF$) synthesis in patients suffering from severe sickle cell disease.

References
[1] Jinek, M. et al. A programmable dual-RNA-guided DNA endonuclease in adaptive bacterial immunity. Science 337, 816–821 (2012).
[2] Cong, L. et al. Multiplex genome engineering using CRISPR/Cas systems. Science 339, 819–823 (2013).
[3] Frangoul, H. et al. CRISPR-Cas9 gene editing for sickle cell disease and beta-thalassemia. N. Engl. J. Med. 384, 252–260 (2021).`
  },
  {
    id: 'perovskite-solar',
    title: 'High-Efficiency Perovskite-Silicon Tandem Solar Cells: Progress and Scalability',
    domain: 'Vật liệu & Năng lượng tái tạo (Materials Science)',
    conference: 'Science / Advanced Energy Materials',
    year: '2023',
    description: 'Nghiên cứu về pin mặt trời tandem Perovskite-Silicon vượt ngưỡng giới hạn Shockley-Queisser với hiệu suất vượt 33%.',
    content: `High-Efficiency Perovskite-Silicon Tandem Solar Cells: Progress and Scalability

Michael Saliba, Henry J. Snaith, Martin A. Green
Institute for Photovoltaics, University of Stuttgart; Department of Physics, University of Oxford; School of Photovoltaic and Renewable Energy Engineering, UNSW Sydney
{saliba@ipv.uni-stuttgart.de, henry.snaith@physics.ox.ac.uk, m.green@unsw.edu.au}

Abstract
Monolithic perovskite-silicon tandem solar cells have shattered traditional power conversion efficiency (PCE) benchmarks, surpassing the theoretical single-junction Shockley-Queisser limit of 29.4% for crystalline silicon. By optically coupling a wide-bandgap metal-halide perovskite top cell ($E_g \\approx 1.68\\text{ eV}$) with a narrow-bandgap silicon bottom cell ($E_g = 1.12\\text{ eV}$), thermalization losses of high-energy photons are minimized. In this paper, we report a certified tandem efficiency of 33.2% through interface passivation using 2D/3D perovskite heterostructures and slot-die coating scalable to industrial wafer formats.

Keywords: Perovskite Solar Cells, Tandem Photovoltaics, Silicon Heterojunction, Shockley-Queisser Limit, Power Conversion Efficiency.

1. Introduction
Decarbonization of global energy systems necessitates photovoltaic modules with both ultra-high conversion efficiency and low levelized cost of electricity (LCOE). While silicon photovoltaics dominate >95% of current commercial deployment, their practical efficiencies are approaching the empirical ceiling around 26.8%. Tandem architectures offer a viable path to transcend this physical barrier.

2. Optical Matching and Theoretical Limits
The tandem photocurrent density $J_{\\text{sc}}$ under standard AM1.5G solar illumination ($1000\\text{ W/m}^2$) is governed by current-matching between top and bottom sub-cells:

$$\\eta = \\frac{V_{\\text{oc}} \\cdot J_{\\text{sc}} \\cdot FF}{P_{\\text{in}}} \\times 100\\%$$

where $V_{\\text{oc}} = V_{\\text{oc}}^{\\text{top}} + V_{\\text{oc}}^{\\text{bottom}}$ in a two-terminal series configuration.

Table 1: Photovoltaic Performance Metrics
Cell Architecture | $V_{\\text{oc}}$ (V) | $J_{\\text{sc}}$ (mA/cm$^2$) | FF (%) | PCE (%)
C-Si Baseline | 0.742 | 42.1 | 82.5 | 25.8%
Perovskite Single | 1.185 | 24.8 | 80.2 | 23.6%
Tandem 2T Monolithic | 1.945 | 20.3 | 84.1 | 33.2%

3. Conclusion
Perovskite-silicon tandem photovoltaics represent the most promising pathway to reach module efficiencies exceeding 30% at grid parity.

References
[1] Shockley, W. & Queisser, H. J. Detailed balance limit of efficiency of p-n junction solar cells. J. Appl. Phys. 32, 510–519 (1961).
[2] Green, M. A. et al. Solar cell efficiency tables (Version 62). Prog. Photovolt. Res. Appl. 31, 651–663 (2023).`
  }
];
